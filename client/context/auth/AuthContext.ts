import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  isLogin: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
  getMyOrders: () => void;
  orders: [];
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  isLogin: false,
  login: () => {},
  logout: () => {},
  getMyOrders: () => {},
  orders: [],
});
export const useAuthContext = () => useContext(AuthContext);
