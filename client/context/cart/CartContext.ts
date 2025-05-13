import type { ICartItems } from "interfaces/CartItems";
import { createContext, useContext } from "react";

interface CartContextType {
  cartItems: ICartItems[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
  updateItemToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  deleteAllItemsToCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: (productId: string) => {},
  updateItemToCart: (productId: string, quantity: number) => {},
  removeFromCart: (productId: string) => {},
  deleteAllItemsToCart: () => {},
});

export const useCart = () => useContext(CartContext);
