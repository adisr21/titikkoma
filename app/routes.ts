import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/group-picker", "routes/group-picker-pages.tsx"),
] satisfies RouteConfig;
