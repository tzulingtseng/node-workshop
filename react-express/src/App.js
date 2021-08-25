import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList/';
import SearchBar from './components/SearchBar/';
import Axios from 'axios';

function App() {
  // products從資料庫來的原始資料．為了讓資料做不同形式的展現
  const [products, setProducts] = useState([]);
  // displayProducts在網頁上準備要呈現的資料
  const [displayProducts, setDisplayProducts] = useState([]);

  const [searchWord, setSearchWord] = useState('');

  // 用開關控制 布林值false代表一開始沒載入資料
  const [isLoading, setIsLoading] = useState(true);

  const [dataList, setDataList] = useState([]);
  // const [userList, setUserList] = useState([]);

  // 模擬一開始自伺服器載入資料
  useEffect(() => {
    Axios.get('http://localhost:3001/api/product').then((response) => {
      // console.log(response.data);
      setDataList(response.data);
    });
    let data = dataList.map((item) => {
      return item;
    });
    // console.log(data);

    // Axios.get('http://localhost:3001/api/user').then((response) => {
    //   // console.log(response.data);
    //   setUserList(response.data);
    // });

    // 開始載入用的動畫spinner
    setIsLoading(true);

    // 一開始載入網頁的時候，setProducts和setDisplayProducts保持一樣，避免搜尋關鍵字拿掉時，要有地方可以記錄原始資料
    setProducts(data);
    setDisplayProducts(data);

    // 關閉載入用的動畫spinner
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // didUpdate searchWord只要有遍就會執行這邊
  useEffect(() => {
    let newProducts = [];
    // 如果有searchWord，不是空白的情況下
    if (searchWord) {
      newProducts = products.filter((product) => {
        return product.name.includes(searchWord);
        // includes可用陣列和字串，這邊用字串
      });
    } else {
      newProducts = [...products];
    }
    setDisplayProducts(newProducts);
  }, [searchWord]);
  // 把原始資料倒回來

  const handleSearch = (products, searchWord) => {
    let newProducts = [];

    if (searchWord) {
      newProducts = products.filter((product) => {
        return product.name.includes(searchWord);
      });
    } else {
      newProducts = [...products];
    }

    return newProducts;
  };

  // 當過濾表單元素有更動時
  // componentDidUpdate
  useEffect(() => {
    // 先開起載入指示器
    setIsLoading(true);

    let newProducts = [];

    // 處理搜尋
    newProducts = handleSearch(products, searchWord);

    setDisplayProducts(newProducts);

    // 1秒後關閉指示器
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [searchWord, products]);

  const spinner = (
    <div>
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-border text-warning" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-border text-dark" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-border text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );

  // 真正要呈現的資料
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="grid search">
              <div className="grid-body">
                <div className="row">
                  <div className="col-md-9">
                    <h2>
                      <i className="fa fa-file-o"></i> 商品列表
                    </h2>
                    <hr />
                    <SearchBar
                      searchWord={searchWord}
                      setSearchWord={setSearchWord}
                    />
                    <div className="padding"></div>

                    {isLoading ? (
                      spinner
                    ) : (
                      <ProductList products={displayProducts} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
