const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
const fs = require("fs");
const mysql = require("mysql");
const { info } = require("console");
require("dotenv").config(); //環境變數套件

// 在所有程式之前連好資料庫
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("資料庫連不上");
  }
});

// 把股票代碼從stock.txt讀出來
function readStockPromise() {
  return new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8", (err, stockCode) => {
      if (err) {
        reject(err);
      } else {
        resolve(stockCode);
      }
    });
  });
}

// 看stock.txt內的股票代碼存不存在資料庫
function queryStockCodePromise(stockCode) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM stock WHERE stock_id=?",
      [stockCode],
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

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

// 寫進stock_price資料表
function insertDataPromise(parseData) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [parseData],
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

// 需求：
// 1. 讀 stock.txt 把股票代碼讀進來
// 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
// 3. 如果是，才去證交所抓資料
// 4. 抓回來的資料存到資料庫的 stock_price 表格裡去

async function doWork() {
  try {
    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await readStockPromise();
    // console.log(stockCode);

    // 2. 去資料庫的 stock 表格查看看，這個代碼(是不是)在我們的服務範圍內
    let dbResults = await queryStockCodePromise(stockCode);
    // console.log(dbResults);

    if (dbResults.length === 0) {
      throw "此股票不在服務範圍內";
    }
    // console.info("在資料庫有查到資料");

    // 3. 如果是，才去證交所抓資料
    let response = await queryStockPromise(stockCode);
    // console.log(response.data.title);

    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
    const twseData = response.data;
    // (4.1)先確認從證交所來的資料有沒有OK
    if (twseData.stat !== "OK") {
      throw "從證交所查到的資料有問題！";
    }
    // (4.2)針對 data 裡的每一組做資料處理
    let parseData = twseData.data.map((item) => {
      // 處理每個item裡面的東西(value)再把處理結果用item接回
      item = item.map((value) => {
        // (4.2.1)處理千位符
        return value.replace(/,/g, "");
      });

      // (4.2.2)處理日期：民國年轉西元年
      //"110/08/05" replace to "1100805", parseInt轉數字,十進位
      item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;

      // (4.2.3)處理+- =>parseInt會處理

      // 把stock_id放進parsedData陣列（因為資料庫需要）
      item.unshift(stockCode);

      // console.log(item);
      return item;
    });
    console.log(parseData);
    // (4.3)把data每組資料處理好後，寫進stock_price 表格裡去
    let insertResult = await insertDataPromise(parseData);
    console.log(insertResult);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
}
doWork();
