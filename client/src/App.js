import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ItemProvider from './context/ItemContext';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import './App.css';

const App = () => {
    return (
        <Router>
            <ItemProvider>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                    </Routes>
                </div>
            </ItemProvider>
        </Router>
    );
};

export default App;
