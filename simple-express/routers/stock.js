// 這裡是 stock router 的模組
const express = require("express");
const router=express.Router();
const connection = require("../utils/db");

// 以下是server.js首頁引用 express 的寫法
// const express = require("express");
// let app = express();
// router 就是一個在 app 底下的小 app
// 也是中間件(middleware)

// stock GET API
router.get("/", async (request, response, next) => {
  let result = await connection.queryAsync("SELECT * FROM stock");
  response.json(result);
});

// stock_price GET API
// /stock/2330 => stockCode = 2330
// /stock/2330?page=1
router.get("/:stockCode", async (req, res, next) => {
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

module.exports=router;