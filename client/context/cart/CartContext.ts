import type { ICartItems } from "interfaces/CartItems";
import { createContext, useContext } from "react";

interface CartContextType {
  cartItems: ICartItems[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: (productId: string) => {},
});

export const useCart = () => useContext(CartContext);
