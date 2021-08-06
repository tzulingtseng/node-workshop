let doWork = function (job, timer, isOK) {
  return new Promise((resolve, reject) => {
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

let job1 = doWork("刷牙", 3000, false);
console.log(job1);

job1.then(
  function (resolve) {
    console.log("resolve函式被呼叫了", resolve);
  },
  function (reject) {
    console.log("reject函式被呼叫了", reject);
  }
);
