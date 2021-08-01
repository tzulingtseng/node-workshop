/* start
 * end
 *（等1秒）
 *Timeout
 *
 * setTimeout 延遲一秒
 * NodeJS is single-thread
 */

console.log("start");

// *環境(瀏覽器)* 來等這1秒
setTimeout(function () {
  console.log("Timeout");
}, 0);
console.log("end");
