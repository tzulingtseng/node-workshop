// 有一個工人會doWork，在function裡面請他做事情，負責做工作的函式？
let doWork = function (job, timer, cb) {
  // setTimeout模擬一個非同步工作，未來有可能是讀檔案/連資料庫/網路傳輸
  setTimeout(() => {
    let dt = new Date();
    // callback慣用的設計
    // 第一個參數: error，如果沒有就放null
    // 第二個參數: 要回覆的資料

    // toISOString():方法返回一個 ISO（ISO 8601 Extended Format）格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。時區總是UTC（協調世界時），加一個後綴“Z”標示。
    cb(null, `完成工作: ${job} at ${dt.toISOString()}`);
  }, timer);
};

// 以下開始請工人工作

// 開始的時間，註記方便測試用
let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);
// 依序執行(做動作)：刷牙 -> 吃早餐 -> 寫功課

// 解決：接續做的工作
// 解決方法--->動作如果要接續著做，只能把下一個動作放在上一個動作的callback(唯有在上一個動作的callback，才可以確認上一個動作已經做完了)-> callback / queue / event-loop/ stack
// 造成新的問題--->callback hell

doWork("刷牙", 3000, function (err, data) {
  // 刷完牙後會被回呼的函式
  // 會在這裡就是已經刷完牙了
  if (err) {
    console.error("發生錯誤了:", err);
    return;
  }
  console.log(data);

  doWork("吃早餐", 5000, function (err, data) {
    // 在這裡就是已經吃完早餐
    if (err) {
      console.error("發生錯誤了:", err);
      return;
    }
    console.log(data);

    doWork("寫功課", 3000, function (err, data) {
      if (err) {
        console.error("發生錯誤了:", err);
        return;
      }
      console.log(data);
    });
  });
});
