import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  isLogin: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  isLogin: false,
  login: () => {},
  logout: () => {},
});
export const useAuthContext = () => useContext(AuthContext);
