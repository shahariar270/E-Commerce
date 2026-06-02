import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCardData, getTopProducts } from "@Store/slices/dashboardSlice";
import './Styles.scss'
import AreaChart from "@Component/AreaChart";
import SubHeading from "@Component/SubHeading";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { card: stats = {}, loading , topProducts} = useSelector(state => state?.dashboard);

  useEffect(() => {
    if (Object.keys(stats).length === 0 && !loading) {
      dispatch(getCardData())
    }
    if(!topProducts.length){
      dispatch(getTopProducts())
    }
  }, []);

  console.log({topProducts});

  const formatMetric = (value, type) => {
    if (loading) return "Loading...";
    const numericValue = Number(value ?? 0);

    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(numericValue);
    }

    return new Intl.NumberFormat("en-US").format(numericValue);
  };

  const statsData = [
    {
      label: "Revenue",
      value: formatMetric(stats?.revenue_count, "currency"),
      change: "+12%",
      positive: true,
      icon: "$",
      accent: "revenue",
      helper: "Total store revenue",
    },
    {
      label: "Orders",
      value: formatMetric(stats?.total_order),
      change: "+5%",
      positive: true,
      icon: "#",
      accent: "orders",
      helper: "Orders received",
    },
    {
      label: "Products",
      value: formatMetric(stats?.total_product),
      change: "-2%",
      positive: false,
      icon: "P",
      accent: "products",
      helper: "Active catalog items",
    },
    {
      label: "Customers",
      value: formatMetric(stats?.customer_count),
      change: "+8%",
      positive: true,
      icon: "C",
      accent: "customers",
      helper: "Registered buyers",
    },
  ];


  const recentOrders = [
    { id: "ORD-001", customer: "John Smith", total: 299.99, status: "Pending" },
    { id: "ORD-002", customer: "Sarah Johnson", total: 149.99, status: "Processing" },
    { id: "ORD-003", customer: "Mike Brown", total: 599.99, status: "Shipped" },
    { id: "ORD-004", customer: "Emily Davis", total: 89.99, status: "Delivered" },
    { id: "ORD-005", customer: "David Wilson", total: 449.99, status: "Cancelled" },
  ];


  return (
    <div className="dashboard-page st-page">
      <SubHeading
        title={"Dashboard"}
        subtitle={"Welcome back! Here's what's happening with your store."}
      />
      {/* Stats Cards */}
      <div className="dashboard-stats">
        {statsData.map((stat) => (
          <div key={stat.label} className={`stat-card stat-card--${stat.accent}`}>
            <div className="stat-card__top">
              <span className="stat-card__icon" aria-hidden="true">{stat.icon}</span>
              <span className={`stat-card__change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-card__content">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__helper">{stat.helper}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Top Products</h3>
            <Link to="/" className="dashboard-card__link">View All</Link>
          </div>
          <div className="dashboard-card__content">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.totalSold}</td>
                    <td className="revenue">${product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <a href="/products?action=add" className="action-button">
            <span className="action-button__icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="/orders" className="action-button">
            <span className="action-button__icon">📦</span>
            <span>View Orders</span>
          </a>
          <a href="/settings" className="action-button">
            <span className="action-button__icon">⚙️</span>
            <span>Settings</span>
          </a>
          <a href="/profile" className="action-button">
            <span className="action-button__icon">👤</span>
            <span>My Profile</span>
          </a>
        </div>
      </div>
      {/* <AreaChart /> */}
    </div>
  );
};

export default Dashboard;
