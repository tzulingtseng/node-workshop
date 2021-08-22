// 請問下列程式碼印出的順序為何？

function syncF() {
  console.log(1);

  setTimeout(() => {
    console.log(2);
  }, 0);
  console.log(3);
}

console.log(4);
syncF();
console.log(5);

// Reply:
// 41352
// 會先執行第12行，印出4，依序到第13行函式，再到第4行印出1，遇到setTimeout先丟給暗樁(node.js的底層不在瀏覽器就不是webapi)處理，印出第9行，12/13已經執行過，就直接執行第14行，最後setTimeout在queue排隊，用event loop拉回call stack，執行裡面的2

// Answer:
// 41352
// 第3行函式不呼叫不會動
// 到第12行同步函式
// 到第13行呼叫asyncF()同步函式到第1行執行，跑出同步函式執行1
// 再執行第6行setTimeout函式，但因為setTimeout是非同步，所以裡面那一坨會丟給暗樁(queue)做，做好時會在queue排隊，等stack沒工作後，由event loop把工作從queue丟到stack
// 程式由上至下執行，再去執行第9行，跑出3
// 再去執行第14行，跑出5
// 等全部工作做完，最後跑出2
