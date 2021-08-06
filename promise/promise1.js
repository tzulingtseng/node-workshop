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
        //   當這個非同步工作是完成的，成功的
        //   我們就呼叫resolve，並把成功結果物件傳出去
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
        //   當這個非同步工作是失敗的
        //   我們就呼叫reject，並把失敗原因物件傳出去
        reject(`失敗工作: ${job} at ${dt.toISOString()}`);
      }
    }, timer);
  });
};

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);

// 依序執行(做動作)：刷牙 -> 吃早餐 -> 寫功課

let job1 = doWork("刷牙", 3000, false);
// dowork回傳的東西是??? Promise物件
console.log(job1); //Promise物件狀態為pending

// 用then()來接收“然後”的結果
job1.then(
  function (resolve) {
    //   準備接收成功的回覆
    console.log("resolve函式被呼叫了", resolve);
    console.log(job1); //Promise物件狀態為fullfilled
  },
  function (reject) {
    //   準備接收失敗的回覆
    console.log("reject函式被呼叫了", reject);
    console.log(job1); //Promise物件狀態為rejected
  }
);
