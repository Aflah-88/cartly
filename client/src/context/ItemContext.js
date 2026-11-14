// src/context/ItemContext.js

import React, { createContext, useState, useEffect } from 'react';

export const itemContext = createContext();

const ItemProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Update cart totals whenever cart changes
  useEffect(() => {
    const newItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const newTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setItemsInCart(newItemsCount);
    setTotalPrice(newTotalPrice);
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item._id !== product._id);
      }
      return prevCart.map(item =>
        item._id === product._id 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };
  
  const removeFromCart = (product) => {
    setCart(prevCart => prevCart.filter(item => item._id !== product._id));
  };

  const clearCart = () => {
    setCart([]);
    setItemsInCart(0);
    setTotalPrice(0);
  };

  return (
    <itemContext.Provider value={{
      products,
      cart,
      itemsInCart,
      totalPrice,
      addToCart,
      decreaseQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </itemContext.Provider>
  );
};

export default ItemProvider;
