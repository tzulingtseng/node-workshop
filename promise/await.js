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

// 語法糖
// async / await
// await -> 等到後面Promise物件的狀態本來是pending變成fullfilled
// await 一定要在 async 的函式裡面用

async function doAllWorks() {
  let result = await doWork("刷牙", 3000, true);
  console.log(result);
  let result2 = await doWork("吃早餐", 5000, true);
  console.log(result2);
  let result3 = await doWork("寫功課", 3000, true);
  console.log(result3);
}
doAllWorks();

// 改寫成立即函式
// (async function () {
//   let result = await doWork("刷牙", 3000, true);
//   console.log(result);
//   let result2 = await doWork("吃早餐", 5000, true);
//   console.log(result2);
//   let result3 = await doWork("寫功課", 3000, true);
//   console.log(result3);
// })();
