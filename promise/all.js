const { isBuffer } = require("util");

let doWorkPromise = function (job, isOK) {
  return new Promise((resolve, reject) => {
    let timer = Math.floor(Math.random() * 5000);
    setTimeout(() => {
      let dt = new Date();
      if (isOK) {
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
        reject(`失敗了 ${job}`);
      }
    }, timer);
  });
};

let job1Promise = doWorkPromise("讀檔案", true);
let job2Promise = doWorkPromise("買海底撈", true);
let job3Promise = doWorkPromise("寫作業", true);
// 三個都要完成，才會到 then
Promise.all([job1Promise, job2Promise, job3Promise]).then((response) => {
  console.log(response);
});
// 最早執行
// Promise.race([job1Promise, job2Promise, job3Promise]).then((response) => {
//   console.log(response);
// });
