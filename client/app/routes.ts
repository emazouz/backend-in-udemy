import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/main.tsx"),
  route("demo", "demo/page.tsx"),
  layout("auth/layout.tsx", [
    route("/login", "auth/login.tsx"),
    route("/register", "auth/register.tsx"),
  ]),
] satisfies RouteConfig;
