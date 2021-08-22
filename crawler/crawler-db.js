const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
const fs = require("fs");
const mysql = require("mysql");
require("dotenv").config();

// 連接資料庫通常放在最外面
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

async function doWork() {
  try {
    let stockNo = await new Promise((resolve, reject) => {
      fs.readFile("stock.txt", "utf8", (err, stockCode) => {
        if (err) {
          reject(err);
        } else {
          resolve(stockCode);
        }
      });
    });

    let response = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"), //動態日期
          stockNo: stockNo,
        },
      }
    );
    console.log(response.data.title);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
}
doWork();

// 捨棄Promise的then
//   .then((stockNo) => {
//     //進入這裡，表示上一個promise已經成功resolve
//     return
//   })
//   .then((response) => {
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// try {
//   doWork();
// } catch (e) {
//   console.error(e);
// }
