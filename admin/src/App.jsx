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
import CouponEdit from "./pages/CouponEdit";
import Customers from "./pages/Customers";
import Subscribers from "./pages/Subscribers";
import { PublicProduct } from "@Pages/PublicProduct";
import { ProductSinge } from "./UserPage/ProductSinge";
import Home from "./UserPage/Home";
import PrivacyPolicy from "./pages/StaticPages/PrivacyPolicy";
import TermsOfUse from "./pages/StaticPages/TermsOfUse";
import FAQ from "./pages/StaticPages/FAQ";
import ErrorPage from "./pages/ErrorPage";
import Cart from "./UserPage/Cart";
import { Checkout } from "./UserPage/Checkout";
import Order from "./UserPage/Order";
import StorefrontLayout from "@Component/Storefront/StorefrontLayout";
import { io } from "socket.io-client";
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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<PublicProduct />} />
          <Route path="product/:id" element={<ProductSinge />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-use" element={<TermsOfUse />} />
          <Route path="faq" element={<FAQ />} />
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
          <Route path="customers" element={<Customers />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="coupon/new" element={<CouponEdit />} />
          <Route path="coupon/:id" element={<CouponEdit />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;