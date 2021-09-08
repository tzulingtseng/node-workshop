import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Stock from './components/Stock';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import StockDetails from './components/StockDetails';
import NotFound from './components/NotFound';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
            </div>
            <Switch>
                <Route path="/" exact>
                    <Stock />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/stock/:stockId/:currentPage?">
                    <StockDetails />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
