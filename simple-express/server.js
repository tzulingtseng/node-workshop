const express = require("express");
const connection = require("./utils/db");

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

// 因 express-validator 很大，部分引用
const { body, validationResult } = require("express-validator");
// 引用後設定驗證規則
const registerRules = [
  body("email").isEmail().withMessage("Email 欄位請填寫正確格式"),
  body("password").isLength({ min: 6 }).withMessage("密碼長度至少為6碼"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("密碼驗證不一致"),
];

const bcrypt=require("bcrypt");

// TODO 1: 建立好路由
// registerRules也可以是一個中間件，如果只想給特定路由使用，可以放在以下位置
// app.post("path","中間件1(真正的處理函式)")
// app.post("path","中間件1","中間件2",.....) => 中間件可以有好幾個，只要最後記得有response
app.post("/auth/register", registerRules, async (request, response, next) => {
  const validateResult = validationResult(request);
  // console.log(validateResult);
  // 不是空的表示驗證不通過
  if (!validateResult.isEmpty()) {
    // 把錯誤拿出來
    let error = validateResult.array();
    console.log(error);
    // 回覆第一個錯誤
    return response
      .status(400)
      .json({ field: error[0].param, message: error[0].msg });
  }
  // TODO 2: 確認前端給的資料有拿到
  // 因前端發請求，req.body拿到前端發過來的資料
  console.log(request.body);
  // TODO 3: 存進資料庫
  // TODO: 密碼不可以是明文 bcrypt.hash(明文,salt)
  // TODO: 格式驗證 -> 後端絕對不可以相信來自前端的資料
  let result = await connection.queryAsync(
    "INSERT INTO members (email, password, name) VALUES (?);",
    [[request.body.email, await bcrypt.hash(request.body.password,10), request.body.name]]
  );
  response.json({});
});

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

// stock GET API
app.get("/stock", async (request, response, next) => {
  let result = await connection.queryAsync("SELECT * FROM stock");
  response.json(result);
});

// stock_price GET API
// /stock/2330 => stockCode = 2330
// /stock/2330?page=1
app.get("/stock/:stockCode", async (req, res, next) => {
  // 取網址上面的參數，用params來取，冒號後面寫什麼，就會有該變數名稱
  // req.params.stockCode
  // 取page的話
  // req.query.page

  let page = req.query.page || 1; // 目前在第幾頁，預設第一頁
  const perPage = 10; // 每一頁的資料是10筆
  // TODO01：總共有幾筆 / 總共有幾頁
  let count = await connection.queryAsync(
    "SELECT COUNT(*) AS total FROM stock_price"
  );
  console.log(count); // [ RowDataPacket { total: 15 } ]
  const total = count[0].total; // total 15
  // console.log(total);
  const lastPage = Math.ceil(total / perPage);
  console.log(total, lastPage);

  // TODO02：取得這一頁應該要有的資料
  // LIMIT:這一頁要取幾筆資料
  // offset:要跳過幾筆資料
  // page 1:1-10 跳過0筆資料
  // page 2:11-20 跳過10筆資料

  let offset = (page - 1) * perPage;

  // req.params.stockCode 冒號後面寫什麼，就會有該變數名稱
  let result = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id=? ORDER BY date LIMIT ? OFFSET ?",
    [req.params.stockCode, perPage, offset]
  );
  // 回覆 pagination 資料給前端
  let pagination = {
    total, // 總共有幾筆
    perPage, // 一頁有幾筆
    lastPage, // 總共有幾頁（最後一頁）
    page, // 目前在第幾頁
  };
  // 撈出來result是陣列，裡面有10筆資料
  // res.json(result)
  // 注意格式的修改
  // res.json({pagination:pagination,result:result});
  // ES6寫法：名稱和變數(key=>value)相同可省略一個，
  // 資料格式變成一個物件裡面分別有pagination, result兩個屬性
  res.json({ pagination, result });
});

// 既然會調到這裡，表示前面都沒有任何符合的路由網址
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
  console.error(err);
  res.status(err.status).json({ message: err.message });
});
app.listen(3001, async function () {
  // 改用pool，需要用的時候自動建立連線，不需要以下手動連線
  // await connection.connectAsync();
  console.log("我們的 web server 啟動了～");
});
