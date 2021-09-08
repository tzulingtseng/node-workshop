const express = require("express");
const connection = require("./utils/db");
const path = require("path");

// 利用 express 建立了一個 express application
let app = express();

// cors用在所有路由和中間件前面
const cors = require("cors");
const { response } = require("express");
app.use(cors());

// 使用這個中間件才可以讀到 body 的資料
app.use(express.urlencoded({ extended: true }));
// 使用這個中間件才可以解析json的資料
app.use(express.json());

// 用中間件設定靜態檔案的位置
// 靜態檔案：圖片、前端的 js, css, html,...
// http://localhost:3001
app.use(express.static(path.join(__dirname, "public")));

// app.use 使用一個 "中間件"
// app.use(middleware)
// app.use和app.get瀏覽器要重新整理發一個請求才會觸發
app.use((req, res, next) => {
  let current = new Date();
  console.log(`有人來訪問 at ${current.toISOString()}`);
  // 一定要呼叫next()，不然不會前往下一個middleware
  next();
});
app.use((req, res, next) => {
  console.log(`第二個中間件`);
  next();
});

// HTTP Method: get, post, put, patch, delete
// 路由是特殊的 middleware，app.METHOD
app.get("/", (request, response, next) => {
  response.send("Hello");
});
app.get("/about", (request, response, next) => {
  // 方法一：
  // 因為已經 response，就到終點了
  // res.send("About us A")
  // 方法一：
  // 如果不呼叫 response，那就還沒終點
  // 記得要呼叫 next 讓他去下一個符合的middleware
  // response.send("about1");

  //如果只有console.log，沒有response和next，瀏覽器的status會是pending，等到timeout
  console.log("我是about!!!!!");
  // next(); //正確去下一個路由
  // 如果next中間有任何參數(不可以是"route")，就等於是通知 express 這裡有錯誤了

  next({
    code: "110001",
    status: 500,
    message: "測試錯誤",
  });
});
app.get("/about", (request, response, next) => {
  response.send("about2");
});

// 引入 stock router 這個中間件
let stockRouter = require("./routers/stock");
// /stock
// /stock/:stockCode
// 使用 stock router 這個中間件
app.use("/stock", stockRouter);

let authRouter = require("./routers/auth");
const { MulterError } = require("multer");
app.use("/auth", authRouter);

// app.get("/api/product", async (req, res, next) => {
//   let page = req.query.page || 1; // 目前在第幾頁，預設第一頁
//   const perPage = 10; // 每一頁的資料是10筆
//   // TODO01：總共有幾筆 / 總共有幾頁

//   let count = await connection.queryAsync(
//     "SELECT COUNT(*) AS total FROM product"
//   );
//   console.log(count); // [ RowDataPacket { total: 30 } ]
//   const total = count[0].total; // total 30
//   const lastPage = Math.ceil(total / perPage);
//   console.log(total, lastPage);

//   // TODO02：取得這一頁應該要有的資料
//   let offset = (page - 1) * perPage;

//   let sqlSelect = await connection.queryAsync(
//     "SELECT * FROM product ORDER BY id LIMIT ? OFFSET ?",
//     [perPage, offset]
//   );
//   let pagination = {
//     total,
//     perPage,
//     lastPage,
//     page,
//   };
//   console.log(pagination);

//   res.json({ pagination, sqlSelect });
// });

// 既然會掉到這裡，表示前面都沒有任何符合的路由網址
// 導致沒有任何 response（旅程一直沒有結束）
// 利用這個特性，把這裡當作404錯誤處理
app.use((req, res, next) => {
  res.status(404).json({ message: "NOT FOUND" });
});

// 超級特殊的middleware
// 他有四個參數，是用來捕捉錯誤，Exception用的
// 通常會把這個錯誤處理middleware放在最下面
// 碰到以下兩種情況會跳到這裡
// (1)沒有處理的 exception
// (2)流程上設計想要跳到這裡=> next(xxx) 透過在 next 傳遞參數
app.use((err, req, res, next) => {
  console.error("來自四個參數的錯誤處理", err);
  if (err instanceof MulterError) {
    return res.status(400).json({ message: "檔案太大了" });
  }
  res.status(err.status).json({ message: err.message });
  // 如果不符合上述特殊的錯誤類別，那表示就是我們自訂的
});
app.listen(3001, async function () {
  // 改用pool，需要用的時候自動建立連線，不需要以下手動連線
  // await connection.connectAsync();
  console.log("我們的 web server 啟動了～");
});
