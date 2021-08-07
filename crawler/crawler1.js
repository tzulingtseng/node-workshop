const axios = require("axios");
const moment = require("moment"); //引用moment套件
// console.log(moment().format("YYYYMMDD"));

axios
  .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY?", {
    params: {
      response: "json",
      date: moment().format("YYYYMMDD"), //動態日期
      stockNo: "2027",
    },
  })
  .then((response) => {
    console.log(response.data);
  });
