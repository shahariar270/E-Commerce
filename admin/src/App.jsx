import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

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
import Coupons from "./pages/Coupons";
import { PublicProduct } from "@Pages/PublicProduct";
import { ProductSinge } from "./UserPage/ProductSinge";
import Home from "./UserPage/Home";
import ErrorPage from "./pages/ErrorPage";
import Cart from "./UserPage/Cart";
import { Checkout } from "./UserPage/Checkout";
import Order from "./UserPage/Order";
import StorefrontLayout from "@Component/Storefront/StorefrontLayout";
import { io } from "socket.io-client";
import SEO from "./components/SEO";
import { getCookie } from "@utils/helper";

const ProtectedAdmin = ({ children }) => {
    const location = useLocation();
    const token = getCookie('token');
    let isAdmin = false;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded?.user_role === 'admin';
        } catch (e) { /* invalid token */ }
    }
    if (!isAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

function App() {
  // useEffect(() => {
  //   const socket = io("http://localhost:5000");

  //   socket.on("connect", () => {
  //     console.log("✅ Connected:", socket.id);
  //   });

  //   socket.on("connect_error", (err) => {
  //     console.log("❌ Error:", err.message);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  return (

    <Router>
      {/* Site-wide default SEO — target keywords applied globally */}
      <SEO
        title="Home"
        description="Launch and manage your online store with the best ecommerce CMS. A complete bangladeshi ecommerce solution built to grow your bangladeshi ecommerce business."
        keywords={[
          "best ecommerce CMS Bangladesh",
          "bangladeshi ecommerce platform",
          "start ecommerce business Bangladesh",
        ]}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<PublicProduct />} />
          <Route path="product/:id" element={<ProductSinge />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Order />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route path="/admin" element={<ProtectedAdmin><Layout /></ProtectedAdmin>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="product/new" element={<ProductEdit />} />
          <Route path="product/:id" element={<ProductEdit />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;