let doWork = function (job, timer, isOK) {
  return new Promise((resolve, reject) => {
    // 非同步工作
    setTimeout(() => {
      let dt = new Date();
      if (isOK) {
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
        reject(`失敗工作: ${job} at ${dt.toISOString()}`);
      }
    }, timer);
  });
};

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);

// 依序執行(做動作)：刷牙 -> 吃早餐 -> 寫功課

//console.log(job1);
doWork("刷牙", 3000, true)
  .then((result) => {
    // 進到這表示刷牙成功了
    console.log("第 1 個函式被呼叫了", result);
    // return 1;
    // 即使我們回傳的是數字，還是會包成 promise 物件
    // Promise.resolve(1)
    return doWork("吃早餐", 5000, false);
  })
  .then((result) => {
    // 進到這表示吃早餐成功了
    console.log("第 2 個函式被呼叫了", result);
    return doWork("寫功課", 3000, true);
  })
  .then((result) => {
    // 進到這表示吃早餐成功了
    console.log("第 3 個函式被呼叫了", result);
  })
  .catch((error) => {
    // 負責捕捉錯誤
    // 捕捉前面所有的promise物件的reject
    // 統一處理錯誤
    console.log("第 4 個函式被呼叫了", error);
  })
  .finally(() => {
    // 無論成功或失敗都會在這裡
    console.log("finally");
  });
