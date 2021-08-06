// Promise 是一個表示非同步運算的「最終」完成或失敗的物件。
// 非同步
// 物件
// 最終成功
// 最終失敗
// new Promise
let doWork = function (job, timer, isOK) {
  return new Promise((resolve, reject) => {
    // 模擬一個非同步工作
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

// 沒有達成接續做這個要求

let job1 = doWork("刷牙", 3000, true);
// console.log(job1);
job1.then(
  (resolve) => {
    console.log("job1的resolve函式被呼叫了", resolve);
  },
  (reject) => {
    console.log("job1的reject函式被呼叫了", reject);
  }
);

let job2 = doWork("吃早餐", 5000, true);
job2.then(
  (result) => {
    console.log("job2的result函式被呼叫了", result);
  },
  (error) => {
    console.log("job2的error函式被呼叫了", error);
  }
);

let job3 = doWork("寫功課", 3000, true);
job3.then(
  (result) => {
    console.log("job3的result函式被呼叫了", result);
  },
  (error) => {
    console.log("job3的error函式被呼叫了", error);
  }
);
