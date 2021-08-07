const axios = require("axios");
const moment = require("moment"); //引用moment第三方套件
// console.log(moment().format("YYYYMMDD"));

//讀股票代碼檔案stock.txt
// nodejs 內建的功能 <-> 不需要npm i，是裝第三方套件時用

//非同步（交給暗樁）：讀檔案、網路傳輸、讀寫資料庫
const fs = require("fs");

new Promise((resolve, reject) => {
  fs.readFile("stock.txt", "utf8", (err, stockCode) => {
    if (err) {
      //   console.error("錯誤",err);
      reject(err);
    } else {
      resolve(stockCode);
    }
  });
})
  .then((stockNo) => {
    //進入這裡，表示上一個promise已經成功resolve
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"), //動態日期
        stockNo: stockNo,
      },
    });
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
