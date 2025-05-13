import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/main.tsx"),
  layout("auth/layout.tsx", [
    route("/login", "auth/login.tsx"),
    route("/register", "auth/register.tsx"),
  ]),
  layout("cart/layout.tsx", [
    route("/cart", "cart/productCart.tsx"),
    route("/orders", "cart/itemsOrder.tsx"),
    route("/checkout", "cart/checkout.tsx"),
  ]),
] satisfies RouteConfig;
