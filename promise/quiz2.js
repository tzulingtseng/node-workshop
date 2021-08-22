async function asyncF() {
  console.log(1);
  await new Promise((resolve, reject) => {
    console.log("A");
    // 非同步->single-thread要把工作交接出去
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
// 41A523
// 一開始先執行第12行，再去第13行遇到asyncF()呼叫，進入第2行，印出1，先await，執行第14行印出5，再跑進去await setTimeout完印出2，再到3

// Answer:
// 41A523
// 第1行函式不呼叫不會動，
// 到第12行同步函式，
// 到第13行呼叫asyncF()同步函式到第1行執行，跑出同步函式執行1，
// new promise本身是同步的，不是先執行await，而是先把new promise這個檔案格式（新的一種交接工作的方式）先做出來，跑出A，
// 再去執行第5行setTimeout()把裡面那坨非同步工作丟給暗樁，
// 本來以為要去執行第11行，但因await按下暫停鍵，把async整個函式暫停，所以不會去執行第11行，
// 反而依序執行第14行跑出5，
// await暫停到，暗樁告訴single-thread setTimeout()的執行結果是成功或失敗，await暫停才結束
// 再依序跑出第11行3

// 有await:41A523
// 無await:41A352
