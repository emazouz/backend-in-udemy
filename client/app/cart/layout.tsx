import { useAuthContext } from "context/auth/AuthContext";
import { Navigate, Outlet } from "react-router";

export default function layout() {
  const { isLogin } = useAuthContext();
  if (!isLogin) return <Navigate to={"/login"} replace />;
  return <Outlet />;
}
