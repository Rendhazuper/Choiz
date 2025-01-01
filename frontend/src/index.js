import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Pages/login";
import Forgot from "./Pages/forgot";
import reportWebVitals from "./reportWebVitals";
import Register from "./Pages/register";
import Reset from "./Pages/reset";
import ProductInput from "./Pages/ProductInput";
import Shop from "./Pages/shop";
import DetailProduk from "./Pages/detailproduk";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import HomeAdmin from "./Pages/Homeadmin";
import Produk from "./Pages/Produk";
import EditProduk from "./Pages/edit-product";
import Listuser from "./Pages/listuser";
import Regisadmin from "./Pages/regisadmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/ProductInput",
    element: <ProductInput />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/produk/:id",
    element: <DetailProduk />,
  },
  {
    path: "/Contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/admin",
    element: <HomeAdmin />,
  },
  {
    path: "/produk",
    element: <Produk />,
  },
  {
    path: "/edit-product/:id",
    element: <EditProduk />,
  },
  {
    path: "/listuser",
    element: <Listuser />,
  },
  {
    path: "/regisadmin",
    element: <Regisadmin />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

reportWebVitals();
