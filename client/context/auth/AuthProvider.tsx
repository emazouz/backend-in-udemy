import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
  return (
    <AuthContext.Provider value={{ username, token, login, isLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
