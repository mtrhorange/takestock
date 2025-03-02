import React, { createContext, useState, useContext } from 'react';

// Define the shape of the cart item
interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.productId === item.productId);
      let qty = 1;
      if (item.qty) {
        qty = item.qty;
      }

      if (existingItem) {
        return prevCart.map(cartItem => (cartItem.productId === item.productId ? { ...cartItem, qty: cartItem.qty + qty } : cartItem));
      } else {
        return [...prevCart, { ...item, qty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
