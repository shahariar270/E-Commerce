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
import ProtectedRoute from "./Routing/ProtectedRoute";
import UserLayout from "./Routing/UserLayout";


function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<PublicProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<PublicProduct />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="product" element={<ProductEdit />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;