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
