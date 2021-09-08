import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from '../utils/config';
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const StockDetails = () => {
  const { stockId,currentPage } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 分頁屬性
  // 記錄我現在在第幾頁
  // currentPage用useParams抓到是字串，故用parseInt轉為數字
  // 如果currentPage 沒有設定，就預設第一頁
  const [page, setPage] = useState(parseInt(currentPage,10) || 1);
  // 總共有幾頁
  const [totalPage, setTotalPage] = useState(10);

  // 點擊頁碼後網址要變換
  let history=useHistory()

  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(
        <li
          style={{
            display: "inline-block",
            margin: "2px",
            backgroundColor: page === i ? "#00d1b2" : "",
            borderColor: page === i ? "#00d1b2" : "#dbdbdb",
            color: page === i ? "#fff" : "#363636",
            borderWidth: "1px",
            width: "28px",
            height: "28px",
            borderRadius: "3px",
            textAlign: "center",
          }}
          // 為什麼要加key? 因為react在底層做DOM物件變化的時候，react比較好比對說 DOM物件 是不是跟上一個是一樣的，一樣的話就不要動，不需要修改，就比較有效率，效能比較好
          key={i}
          onClick={(e) => {
            setPage(i);
          }}
        >
          {i}
        </li>
      );
    }
    return pages;
  };

  useEffect(() => {
    const getStockData = async () => {
      try {
        let res = await axios.get(`${API_URL}/stock/${stockId}?page=${page} `);

        let data = res.data.result;
        setTotalPage(res.data.pagination.lastPage)
        setData(data);
        setError(null);
        history.push(`/stock/${stockId}/${page}`);
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    };
    getStockData();
  }, [page]);
  // [] --> 只有第一次 render 的時候才觸發
  // [page] --> page 變的時候 -> render -> 這個 effect 會被呼叫

  return (
    <div>
      {error && <div>{error}</div>}
      <ul>{getPages()}</ul>
      {data &&
        data.map((day) => (
          <div
            className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6"
            key={day.date}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              日期： {day.date.slice(0, 10)}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交金額： {day.amount}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交股數： {day.volume}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              開盤價： {day.open_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              收盤價： {day.close_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              漲跌價差： {day.delta_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最高價： {day.high_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最低價： {day.low_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交筆數： {day.transactions}
            </h2>
          </div>
        ))}
    </div>
  );
};

export default StockDetails;
