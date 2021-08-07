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

// Reply:
// 41523
// 一開始先執行第12行，再去第13行遇到asyncF()呼叫，進入第2行，印出1，先await，執行第14行印出5，再跑進去await setTimeout完印出2，再到3
