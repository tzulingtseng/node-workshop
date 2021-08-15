const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
const fs = require("fs");
const mysql = require("mysql");
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

async function queryStockPromise(stockCode) {
  return await axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
    params: {
      response: "json",
      date: moment().format("YYYYMMDD"), //動態日期
      stockNo: stockCode,
    },
  });
}

function queryStockCodePromise(stockCode) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM stock WHERE stock_id=?",
      [stockCode],
      function (error, results, fields) {
        if (error) {
          //錯誤處理
          reject(error);
        }
        // if (results.length === 0) {
        //   // 錯誤處理
        //   reject("在資料庫查無資料!!!");
        // }
        // 正確處理:在資料庫有資料
        resolve(results);
      }
    );
  });
}

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

async function doWork() {
  try {
    // 1. 讀 stock.txt 把股票代碼讀進來
    let stockCode = await readStockPromise();

    // 2. 去資料庫的 stock 表格查看看，這個代碼是不是在我們的服務範圍內
    let dbResults = await queryStockCodePromise(stockCode);
    // 職責切割
    if (dbResults.length === 0) {
      // console.log("此股票代碼不在服務範圍內");
      // return;
      throw "此股票代碼不在服務範圍內";
    }
    // console.info("在資料庫有查到資料");

    // 3. 如果是，才去證交所抓資料
    let response = await queryStockPromise(stockCode);
    // console.log(response.data);

    // 4. 抓回來的資料存到資料庫的 stock_price 表格裡去
    const twseData = response.data;
    if (twseData.stat !== "OK") {
      throw "從證交所查到的資料有問題！";
    }

    let parseData = twseData.data.map((item) => {
      // 針對 data 裡的每一組做資料處理

      // 處理千位符
      // 處理日期：民國年轉西元年
      // 處理+- =>parseInt會處理

      // 處理每個item裡面的東西(value)再把處理結果用item接回
      item = item.map((value) => {
        return value.replace(/,/g, "");
      });

      // 110/08/09 => 1100809 + 19110000
      // //g => /中間放想要找的東西，但因為也是/，故用斜線前面用反斜線\跳脫/g
      //"110/08/05" replace to "1100805", parseInt轉數字,十進位
      item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;

      // 把stock_id放進parsedData陣列（因為資料庫需要）
      item.unshift(stockCode);

      // console.log(item);
      return item;
    });
    console.log(parseData);

    let insertResult = await insertDataPromise(parseData);
    console.log(insertResult);
  } catch (e) {
    console.error("***********");
    console.error(e);
  } finally {
    connection.end();
  }
}
doWork();
