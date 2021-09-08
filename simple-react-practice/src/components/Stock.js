import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Stock = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStockData = async () => {
            try {
                let res = await axios.get('http://localhost:3001/stock');

                let data = res.data;

                setData(data);
                setError(null);
            } catch (e) {
                console.log(e);
                setError(e.message);
            }
        };
        getStockData();
    }, []);

    return (
        <div>
            {error && <div>{error}</div>}
            <h2 className="ml-7 mt-6 text-xl text-gray-600">股票代碼</h2>
            {data && data.map(stock => (
                <div className="bg-white bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg m-6 cursor-pointer" key={stock.stock_id}>
                    <Link to={`/stock/${stock.stock_id}`}>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{stock.stock_id}</h2>
                        <p className="text-gray-700">{stock.stock_name}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Stock;
