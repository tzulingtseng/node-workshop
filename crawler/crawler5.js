const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
// const fs = require("fs");
const fs = require('fs/promises');
// const mysql = require("mysql");
const mysql = require('mysql2/promise');
const { info } = require("console");
require("dotenv").config(); //環境變數套件

// 去證交所抓資料
function queryStockPromise(stockCode) {
  return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
    params: {
      response: "json",
      date: moment().format("YYYYMMDD"), //動態日期
      stockNo: stockCode,
    },
  });
}

// 需求：
// 1. 讀 stock.txt 把股票代碼讀進來
// 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
// 3. 如果是，才去證交所抓資料
// 4. 抓回來的資料存到資料庫的 stock_price 表格裡去

async function doWork() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
      
    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await fs.readFile("stock.txt", "utf8");
    console.log("stock code:",stockCode);

    // 2. 去資料庫的 stock 表格查看看，這個代碼(是不是)在我們的服務範圍內
    let [dbResults]=await connection.execute("SELECT * FROM stock WHERE stock_id=?",[stockCode],)
    console.log(dbResults);

    if (dbResults.length === 0) {
      throw "此股票不在服務範圍內";
    }
    // console.info("在資料庫有查到資料");

    // 3. 如果是，才去證交所抓資料
    let response = await queryStockPromise(stockCode);
    // console.log(response.data.title);

    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
    const twseData = response.data;
    if (twseData.stat !== "OK") {
      throw "從證交所查到的資料有問題！";
    }
    let parseData = twseData.data.map((item) => {
      item = item.map((value) => {
        return value.replace(/,/g, "");
      });

      item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;

      item.unshift(stockCode);

      // console.log(item);
      return item;
    });
    console.log(parseData);
    const [insertResult] = await connection.query(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [parseData]
    );
    console.log(insertResult);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
}
doWork();
