function processStockDay(stockCode, rawData) {
  // (4.2)針對 data 裡的每一組做資料處理
  // twseData.data
  return rawData.map((item) => {
    // 處理每個item裡面的東西(value)再把處理結果用item接回
    item = item.map((value) => {
      // (4.2.1)處理千位符
      return value.replace(/,/g, "");
    });

    // (4.2.2)處理日期：民國年轉西元年
    //"110/08/05" replace to "1100805", parseInt轉數字,十進位
    item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;

    // (4.2.3)處理+- =>parseInt會處理

    // 把stock_id放進parsedData陣列（因為資料庫需要）
    item.unshift(stockCode);

    // console.log(item);
    return item;
  });
}

module.exports = {
  processStockDay,
};
