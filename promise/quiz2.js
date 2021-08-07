async function asyncF() {
  console.log(1);
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2);
      resolve();
    }, 0);
  });
  console.log(3);
}

console.log(4);
asyncF();
console.log(5);

// Answer:
// 41523
// 一開始先執行第1行，再去第12行，丟4到call stack，return call stack的4出來，再去第13行遇到回呼asyncF()，進入第2行，印出1，接下來為什麼不會等async/await完呢？？？而是先印出5，再跑進去await等setTimeout完印出2，再到3
