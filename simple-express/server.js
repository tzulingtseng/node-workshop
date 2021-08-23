const express = require("express");
const connection = require("./utils/db");

// 利用 express 建立了一個 express application
let app = express();

// app.use和app.get瀏覽器要重新整理發一個請求才會觸發
app.use((req, res, next) => {
  let current = new Date();
  console.log(`有人來訪問 at ${current.toISOString()}`);
  next();
});

app.use((req, res, next) => {
  console.log(`第二個中間件`);
  next();
});

// HTTP Method: get, post, put, patch, delete
app.get("/", (request, response, next) => {
  response.send("Hello");
});
app.get("/about", (request, response, next) => {
  response.send("about1");
});
app.get("/about", (request, response, next) => {
  response.send("about2");
});
app.get("/stock", async (request, response, next) => {
  let result = await connection.queryAsync("SELECT * FROM stock");
  response.json(result);
});

app.listen(3000, async function () {
  await connection.connectAsync();
  console.log("我們的 web server 啟動了～");
});
