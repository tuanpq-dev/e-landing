import React from "react";
import config from "../config/config";

const Home = React.lazy(() => import("../pages/Home"));
const Product = React.lazy(() => import("../pages/Product"));
const About = React.lazy(() => import("../pages/About"));

export const routeConfig = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: config.routes.HOME,
        element: <Home />,
    },
    {
        path: config.routes.PRODUCT,
        element: <Product />
    },
    {
        path: config.routes.ABOUT,
        element: <About />
    }
];

export default routeConfig;