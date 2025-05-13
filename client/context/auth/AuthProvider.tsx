import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "constant/BasicUrl";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(window.localStorage.getItem("username"));
      setToken(window.localStorage.getItem("token"));
    }
  }, []);

  const login = (username: string, token: string) => {
    setUsername(username);
    setToken(token);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("token", token);
  };

  const isLogin = !!token;

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
    setToken(null);
  };

  const getMyOrders = async () => {
    const response = await fetch(`${BASE_URL}/user/my-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return;
    const data = await response.json();
    setOrders(data.data);
  };
 
  return (
    <AuthContext.Provider
      value={{ username, token, login, isLogin, logout, getMyOrders, orders }}
    >
      {children}
    </AuthContext.Provider>
  );
};
