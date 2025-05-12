import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
import { useEffect, useState } from "react";

export default function productCart() {
  const [cart, setCart] = useState();
  const [error, setError] = useState("");
  const { token } = useAuthContext();

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
          setError("Failed to get card");
        }
        const data = await response.json();
        console.log("data: ", data);
        setCart(data);
      } catch (err) {
        setError(`Error failed ${err}`);
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  return (
    <div>
      <h1>Product Cart</h1>
    </div>
  );
}
