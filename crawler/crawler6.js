// 需求：
// 1. 讀 stock.txt 把股票代碼讀進來
// 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
// 3. 如果是，才去證交所抓資料
// 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
const fs = require("fs/promises");
const connection = require("./utils/db");
const { processStockDay } = require("./utils/TWSEDataProcessor");
const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

(async () => {
  try {
    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await fs.readFile("stock.txt", "utf-8");
    // console.log(stockCode); // for check

    // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
    // create the connection
    // 職責切割
    await connection.connectAsync();

    // query database
    let dbResults = await connection.queryAsync(
      "SELECT * FROM stock WHERE stock_id=?",
      [stockCode]
    );
    console.log(dbResults);
    if (dbResults.length === 0) {
      throw "此股票不在服務範圍內";
    }

    // 3. 如果是，才去證交所抓資料
    let response = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"), //動態日期
          stockNo: stockCode,
        },
      }
    );
    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
    const twseData = response.data;
    // (4.1)先確認從證交所來的資料有沒有OK
    if (twseData.stat !== "OK") {
      throw "從證交所查到的資料有問題！";
    }
    let parseData = processStockDay(stockCode, twseData.data);

    let results = await connection.queryAsync(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [parseData]
    );
    console.log(results);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
})();
