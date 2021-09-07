const express = require("express");
const router=express.Router();

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

const bcrypt = require("bcrypt");

// TODO 1: 建立好路由
// registerRules也可以是一個中間件，如果只想給特定路由使用，可以放在以下位置
// app.post("path","中間件1(真正的處理函式)")
// app.post("path","中間件1","中間件2",.....) => 中間件可以有好幾個，只要最後記得有response
router.post("/register", registerRules, async (request, response, next) => {
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
    [
      [
        request.body.email,
        await bcrypt.hash(request.body.password, 10),
        request.body.name,
      ],
    ]
  );
  response.json({});
});

module.exports=router;