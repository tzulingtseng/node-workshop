const mysql = require("mysql");
require("dotenv").config(); //環境變數套件
const Promise = require("bluebird"); // Promise用大寫，要蓋掉不能用new Promise()

// exports = module.exports = {};

let connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 設定預設值 ||前面沒有的話就執行後面10
  connectionLimit: process.env.CONNECTION_LIMIT || 10,
  dateStrings:true,
});
// bluebird
// 擴充
// connect -> connectAsync =>兩者都有保留
// query -> queryAsync =>兩者都有保留

// 把connection Promise化
connection = Promise.promisifyAll(connection);

// return module.exports;

//以下考量要用A還是B(8/14 13:10)
// 搬模組原則：
// 1.先寫程式碼，需要搬的時候在搬，避免過度設計
// 2.避免動到原本寫好的程式碼

// // A:
module.exports = connection;
// const connection = require();
// connection.query;

// // B:
// module.exports.connection = connection;
// // 寫法一
// const connection = require();
// connection.connection.query;
// // 寫法二
// const db = require();
// db.connection.query;
// // 寫法三：用大括號取物件裡面的屬性
// const { connection } = require();
// connection.query;
