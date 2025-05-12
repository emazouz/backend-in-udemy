import { useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { ICartItems } from "interfaces/CartItems";
export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItems[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const addItemToCart = (productId: string) => {
    console.log(productId);
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        addItemToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
