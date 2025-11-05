import { createContext, useContext, useState, ReactNode } from "react";
import { FoodItem } from "@/types/order";

interface CartItem extends FoodItem {
  cartQuantity: number;
  preparationType: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: FoodItem, quantity: number, preparationType: string) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: FoodItem, quantity: number, preparationType: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        ci => ci.id === item.id && ci.preparationType === preparationType
      );
      
      if (existingItem) {
        return prev.map(ci =>
          ci.id === item.id && ci.preparationType === preparationType
            ? { ...ci, cartQuantity: ci.cartQuantity + quantity }
            : ci
        );
      }
      
      return [...prev, { ...item, cartQuantity: quantity, preparationType }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getTotalAmount,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
