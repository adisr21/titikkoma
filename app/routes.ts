import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/group-picker", "routes/group-picker-pages.tsx"),
    route("/deadline-widget", "routes/deadline-widget-pages.tsx"),
    route("/paraphrase-checker", "routes/paraphrase-checker-pages.tsx"),
    route('/citation-generator', 'routes/citation-generator-pages.tsx'),
    route('/halo-lecturer', 'routes/halo-lecturer-pages.tsx'),
    route('/word-counter', 'routes/word-counter-pages.tsx'),
    route('/connect-dots', 'routes/connect-dots-pages.tsx'),
    route('/spin-wheel', 'routes/spin-wheel-pages.tsx'),
] satisfies RouteConfig;
