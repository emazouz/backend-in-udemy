import { useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { ICartItems } from "interfaces/CartItems";
import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthContext();
  const [cartItems, setCartItems] = useState<ICartItems[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const addItemToCart = async (productId: string) => {
    const response = await fetch(`${BASE_URL}/card/items`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });
    if (!response) {
      throw new Error("failed adding product to cart");
    }
    const data = await response.json();
    if (!data) {
      throw new Error("failed data");
    }
    const itemsCardMapped = data.itemsCard.map(
      ({ product, quantity }: { product: any; quantity: number }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        unitPrice: product.unitPrice,
        quantity,
      })
    );
    setCartItems([...itemsCardMapped]);
    setTotalAmount(data.totalAmount);
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
