const express = require("express");
const router = express.Router();
// nodejs 內建的物件
const path=require("path");

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

// 為了密碼加密
const bcrypt = require("bcrypt");

// 為了處理 multipart/form-data 需要用到其他中間件
const multer = require("multer");
// 通常是為了上傳，所以需要告訴他上傳的檔案存在哪裡
// 通常存在硬碟 => diskStorage 想學其它找老師???
const storage = multer.diskStorage({
  // 設定儲存檔案目的地
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname,"../","public","uploads"));
  },
  // 檔案命名
  filename: function (req, file, callback) {
    console.log(file);
    callback(null,file.originalname)
  },
});

const uploader = multer({
  storage: storage,
  // 檔案驗證（非常重要）
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      cb(new Error("不接受的檔案型態"), false);
    }
    cb(null, true);
  },
  limits: {
    // 1M
    fileSize: 1024 * 1024,
  },
});

// TODO 1: 建立好路由
// registerRules也可以是一個中間件，如果只想給特定路由使用，可以放在以下位置
// app.post("path","中間件1(真正的處理函式)")
// app.post("path","中間件1","中間件2",.....) => 中間件可以有好幾個，只要最後記得有response
router.post(
  "/register",
  // multer 中間件必須放在 validation 前面
  uploader.single("photo"),
  // 因為驗證規則需要用到解譯後的資料，所以需要先經過 multer
  registerRules,
  async (request, response, next) => {
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
    // 確認 file 有拿到 (如果 multer 有成功的話)
    console.log(request.file);
    // TODO 3: 存進資料庫
    // TODO: 密碼不可以是明文 bcrypt.hash(明文,salt)
    // TODO: 格式驗證 -> 後端絕對不可以相信來自前端的資料
    // let result = await connection.queryAsync(
    //   "INSERT INTO members (email, password, name) VALUES (?);",
    //   [
    //     [
    //       request.body.email,
    //       await bcrypt.hash(request.body.password, 10),
    //       request.body.name,
    //     ],
    //   ]
    // );
    response.json({});
  }
);

module.exports = router;
