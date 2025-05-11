import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  login: (username: string, token: string) => void;
  isLogin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  login: () => {},
  isLogin: false
});
export const useAuthContext = () => useContext(AuthContext);
