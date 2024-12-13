import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import CartCheck from "../pages/CartCheck";
import History from "../pages/user/History";
import CheckOut from "../pages/CheckOut";
import Login from "../pages/auth/Login";
import Layout from "../layouts/Layout";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Product from "../pages/admin/Product";
import Category from "../pages/admin/Category";
import Manage from "../pages/admin/Manage";
import LayoutUser from "../layouts/LayoutUser";
import HomeUser from "../pages/user/HomeUser";
import ProtectRouteUser from "./ProtectRouteUser";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import EditProduct from "../pages/admin/EditProduct";
import Payment from "../pages/user/Payment";
import ManageOrder from "../pages/admin/ManageOrder";
import NewRegister from "../pages/auth/NewRegister";
import CategoryDetails from "../components/category/CategoryDetails";
import ProductDetail from "../components/product/ProductDetail";
import ErrorFallBack from "./ErrorFallBack";
import ProductBySearch from "../components/product/ProductBySearch";

const router = createBrowserRouter([
  //No login
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "cart", element: <Cart /> },
      { path: "cartcheck/:id", element: <CartCheck /> },
      { path: "checkout", element: <CheckOut /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <NewRegister /> },
      { path: "category/:id", element: <CategoryDetails /> },
      { path: "product/:id/:slug", element: <ProductDetail /> },
      { path: "product/:query", element: <ProductBySearch /> },
    ],
    errorElement: <ErrorFallBack />, // กรณี route ไม่พบหรือ error
  },
  {
    path: "/admin",
    element: <ProtectRouteAdmin element={<LayoutAdmin />}/>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "category", element: <Category /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <EditProduct /> },
      { path: "manage", element: <Manage /> },
      { path: "orders", element: <ManageOrder /> },
    ],
    errorElement: <ErrorFallBack />, // กรณี route ไม่พบหรือ error
  },
  {
    path: "/user",
    element: <ProtectRouteUser element={<LayoutUser />}/>,
    children: [
      // { index: true, element: <HomeUser /> },
      { index: true, element: <Home /> },
      { path: "payment", element: <Payment /> },
      { path: "history", element: <History /> },
    ],
    errorElement: <ErrorFallBack />, // กรณี route ไม่พบหรือ error
  },
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
