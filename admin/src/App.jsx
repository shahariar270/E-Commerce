import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductEdit from "./pages/ProductEdit";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import { PublicProduct } from "@Pages/PublicProduct";
import { ProductSinge } from "./UserPage/ProductSinge";
import ErrorPage from "./pages/ErrorPage";
import Cart from "./UserPage/Cart";
import { Checkout } from "./UserPage/Checkout";
import Order from "./UserPage/Order";
import { useEffect } from "react";
import { io } from "socket.io-client";


function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<PublicProduct />} />
          <Route path="product/:id" element={<ProductSinge />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Order />} />
          <Route path="wishlist" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="product/new" element={<ProductEdit />} />
          <Route path="product/:id" element={<ProductEdit />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;