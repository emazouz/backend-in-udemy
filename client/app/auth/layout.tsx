import { Outlet } from "react-router";

export default function Layout() {
  console.log("Protected Auth");
  return <Outlet />;
}
