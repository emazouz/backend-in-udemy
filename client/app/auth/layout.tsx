import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <h1 className="text-red-600 text-xl uppercase">layout page</h1>
      <header>NavBar {" -> "} Auth</header>
      <Outlet />
      <header>SidBar {" -> "} Auth</header>
    </div>
  );
}
