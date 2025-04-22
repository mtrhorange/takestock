import React, { createContext, useState, useContext } from 'react';

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  imageUrl: string;
  selected: boolean;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  toggleSelect: (productId: string, selected: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.productId === item.productId);
      const qty = item.qty || 1;

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.productId === item.productId
            ? { ...cartItem, qty: cartItem.qty + qty }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, qty, selected: false }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    setCart(prevCart => prevCart.map(item => (item.productId === productId ? { ...item, qty } : item)));
  };

  const toggleSelect = (productId: string, selected: boolean) => {
    setCart(prevCart => prevCart.map(item => (item.productId === productId ? { ...item, selected } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, toggleSelect, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
