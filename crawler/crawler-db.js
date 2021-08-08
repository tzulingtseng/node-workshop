const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
const fs = require("fs");
const mysql = require("mysql");

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

    // 放在需要連資料庫的地方
    var connection = mysql.createConnection({
      host: "localhost",
      user: "admin",
      password: "1111",
      database: "stock",
    });

    connection.connect((err) => {
      if (err) {
        console.error("資料庫連不上");
      }
    });

    connection.end();

    // let response = await axios.get(
    //   "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
    //   {
    //     params: {
    //       response: "json",
    //       date: moment().format("YYYYMMDD"), //動態日期
    //       stockNo: stockNo,
    //     },
    //   }
    // );
    // console.log(response.data.title);
  } catch (e) {
    console.error(e);
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
