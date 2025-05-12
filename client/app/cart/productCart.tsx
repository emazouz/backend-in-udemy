import { useCart } from "context/cart/CartContext";

export default function productCart() {
  const { cartItems } = useCart();
  return (
    <div>
      {cartItems.map((item) => (
        <h1>{item.title}</h1>
      ))}
    </div>
  );
}
