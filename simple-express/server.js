const express = require("express");
const connection = require("./utils/db");

// 利用 express 建立了一個 express application
let app = express();

// cors用在所有路由和中間件前面
const cors = require("cors");
app.use(cors());

// app.use和app.get瀏覽器要重新整理發一個請求才會觸發
app.use((req, res, next) => {
  let current = new Date();
  console.log(`有人來訪問 at ${current.toISOString()}`);
  next();
});

// HTTP Method: get, post, put, patch, delete
app.get("/", (request, response, next) => {
  response.send("Hello");
});
app.use((req, res, next) => {
  console.log(`第二個中間件`);
  next();
});
app.get("/about", (request, response, next) => {
  response.send("about1");
});
app.get("/about", (request, response, next) => {
  response.send("about2");
});

// stock GET API
app.get("/stock", async (request, response, next) => {
  let result = await connection.queryAsync("SELECT * FROM stock");
  response.json(result);
});

// stock_price GET API
// stock/2330 => stockCode = 2330
app.get("/stock/:stockCode", async (req, res, next) => {
  // req.params.stockCode 冒號後面寫什麼，就會有該變數名稱
  let result = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id=?",
    [req.params.stockCode]
  );
  res.json(result);
});
// 404錯誤處理
// app.use((req, res, next) => {
//   res.status(404).json({ message: "NOT FOUND" });
// });
app.listen(3000, async function () {
  // 改用pool，需要用的時候自動建立連線，不需要以下手動連線
  // await connection.connectAsync();
  console.log("我們的 web server 啟動了～");
});
