import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { ICartItems } from "interfaces/CartItems";
import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthContext();
  const [cartItems, setCartItems] = useState<ICartItems[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/card`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response) {
          console.error("Failed to get card");
        }
        const data = await response.json();
        const itemsCardMapped = data.itemsCard.map(
          ({
            product,
            quantity,
            unitPrice,
          }: {
            product: any;
            quantity: number;
            unitPrice: number;
          }) => ({
            productId: product._id,
            title: product.title,
            image: product.image,
            unitPrice,
            price: product.price,
            quantity,
          })
        );
        setCartItems([...itemsCardMapped]);
        setTotalAmount(data.totalAmount);
      } catch (err) {
        console.error(`Error failed ${err}`);
        console.error(err);
      }
    };
    fetchCart();
  }, [token]);

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
      ({
        product,
        quantity,
        unitPrice,
      }: {
        product: any;
        quantity: number;
        unitPrice: number;
      }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        unitPrice,
        price: product.price,
        quantity,
      })
    );
    setCartItems([...itemsCardMapped]);
    setTotalAmount(data.totalAmount);
  };

  const updateItemToCart = async (productId: string, quantity: number) => {
    const response = await fetch(`${BASE_URL}/card/items`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
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
      ({
        product,
        quantity,
        unitPrice,
      }: {
        product: any;
        quantity: number;
        unitPrice: number;
      }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        unitPrice,
        price: product.price,
        quantity,
      })
    );
    setCartItems([...itemsCardMapped]);
    setTotalAmount(data.totalAmount);
  };

  const removeFromCart = async (productId: string) => {
    const response = await fetch(`${BASE_URL}/card/items/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response) {
      throw new Error("failed deleting product to cart");
    }
    const data = await response.json();
    if (!data) {
      throw new Error("failed data");
    }

    const itemsCardMapped = data.itemsCard.map(
      ({
        product,
        quantity,
        unitPrice,
      }: {
        product: any;
        quantity: number;
        unitPrice: number;
      }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        unitPrice,
        price: product.price,
        quantity,
      })
    );
    setCartItems([...itemsCardMapped]);
    setTotalAmount(data.totalAmount);
  };

  const deleteAllItemsToCart = async () => {
    const response = await fetch(`${BASE_URL}/card/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response) {
      throw new Error("failed deleting product to cart");
    }
    const data = await response.json();
    if (!data) {
      throw new Error("failed data");
    }

    const itemsCardMapped = data.itemsCard.map(
      ({
        product,
        quantity,
        unitPrice,
      }: {
        product: any;
        quantity: number;
        unitPrice: number;
      }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        unitPrice,
        price: product.price,
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
        updateItemToCart,
        removeFromCart,
        deleteAllItemsToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
