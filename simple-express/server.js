const express = require("express");

// 利用 express 建立了一個 express application
let app = express();

let current = new Date();
app.use((req, res, next) => {
  console.log(`有人來訪問 at ${current.toISOString()}`);
  next();
});

app.use((req, res, next) => {
  console.log(`第二個中間件`);
  next();
});

// HTTP Method: get, post, put, patch, delete
app.get("/", function (request, response, next) {
  response.send("Hello");
});
app.get("/about", function (request, response, next) {
  response.send("about111");
});

app.listen(3000, function () {
  console.log("我們的 web server 啟動了～");
});
