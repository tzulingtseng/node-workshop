//console.log("Hello world!");

function sum(n) {
  //最佳美容解法．不用result變數
  return ((n + 1) * n) / 2;

  //最佳解法
  // let result = 0;
  // result = ((n+1)*n)/2;
  // return result;

  //迴圈法
  //let result = 0;
  // for(let i=1; i<=n; i++){
  //     result+=i;
  // }
  //return result;
}
// console.log(sum(1)); //1
// console.log(sum(2)); //3
// console.log(sum(10)); //55
