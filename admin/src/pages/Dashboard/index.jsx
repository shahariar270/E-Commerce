import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCardData } from "@Store/slices/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { card: stats = {}, loading } = useSelector(state => state?.dashboard)

  useEffect(() => {
    if (Object.keys(stats).length === 0 && !loading) {
      dispatch(getCardData())
    }
  }, [stats, loading, dispatch]);

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

  const topProducts = [
    { name: "Wireless Headphones", sales: 145, revenue: 14498 },
    { name: "Smart Watch", sales: 98, revenue: 19599 },
    { name: "Running Shoes", sales: 87, revenue: 6959 },
    { name: "Bluetooth Speaker", sales: 76, revenue: 4559 },
    { name: "Laptop Stand", sales: 54, revenue: 1619 },
  ];

  return (
    <div className="dashboard-page st-page">
      <div className="dashboard-page__header st-page__header">
        <div className="dashboard-page__title st-page__title">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

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
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Recent Orders</h3>
            <a href="/orders" className="dashboard-card__link">View All</a>
          </div>
          <div className="dashboard-card__content">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td className="order-total">${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status status--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Top Products</h3>
            <a href="/products" className="dashboard-card__link">View All</a>
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
                    <td>{product.sales}</td>
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

      <style>{`
        .dashboard-page {
          color: var(--st-text-primary);
        }

        .dashboard-page__header {
          margin-bottom: 24px;
        }

        .dashboard-page__title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--st-text-primary);
        }

        .dashboard-page__title p {
          margin: 6px 0 0;
          font-size: 14px;
          color: #667085;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          position: relative;
          min-height: 154px;
          overflow: hidden;
          background: var(--st-text-white, #fff);
          border: 1px solid #e7ebf0;
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: var(--card-accent);
        }

        .stat-card:hover {
          border-color: #d6dde7;
          box-shadow: 0 16px 36px rgba(16, 24, 40, 0.1);
          transform: translateY(-2px);
        }

        .stat-card--revenue {
          --card-accent: #1570ef;
          --card-accent-soft: #eff8ff;
        }

        .stat-card--orders {
          --card-accent: #039855;
          --card-accent-soft: #ecfdf3;
        }

        .stat-card--products {
          --card-accent: #dc6803;
          --card-accent-soft: #fffaeb;
        }

        .stat-card--customers {
          --card-accent: #7f56d9;
          --card-accent-soft: #f4f3ff;
        }

        .stat-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .stat-card__icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--card-accent-soft);
          color: var(--card-accent);
          font-size: 16px;
          font-weight: 800;
        }

        .stat-card__content {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .stat-card__label {
          font-size: 13px;
          font-weight: 600;
          color: #667085;
        }

        .stat-card__value {
          min-height: 34px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 800;
          color: #1d2939;
          overflow-wrap: anywhere;
        }

        .stat-card__helper {
          font-size: 12px;
          color: #98a2b3;
        }

        .stat-card__change {
          font-size: 12px;
          font-weight: 700;
          padding: 5px 9px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .stat-card__change.positive {
          background-color: #ecfdf3;
          color: #027a48;
        }

        .stat-card__change.negative {
          background-color: #fef3f2;
          color: #b42318;
        }

        @media (max-width: 1180px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background: var(--st-text-white, #fff);
          border: 1px solid #e7ebf0;
          border-radius: 8px;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
          overflow: hidden;
        }

        .dashboard-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--st-border);
          background: #fcfcfd;
        }

        .dashboard-card__header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--st-text-primary);
        }

        .dashboard-card__link {
          font-size: 13px;
          font-weight: 600;
          color: var(--st-primary);
          text-decoration: none;
        }

        .dashboard-card__link:hover {
          text-decoration: underline;
        }

        .dashboard-card__content {
          padding: 0;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dashboard-table th,
        .dashboard-table td {
          padding: 13px 20px;
          text-align: left;
        }

        .dashboard-table th {
          font-size: 12px;
          font-weight: 700;
          color: #667085;
          text-transform: uppercase;
          background-color: #f8fafc;
        }

        .dashboard-table td {
          font-size: 14px;
          color: var(--st-text-primary);
          border-bottom: 1px solid var(--st-border);
        }

        .dashboard-table tr:last-child td {
          border-bottom: none;
        }

        .dashboard-table .order-id {
          font-weight: 700;
          color: var(--st-primary);
        }

        .dashboard-table .order-total {
          font-weight: 700;
        }

        .dashboard-table .revenue {
          font-weight: 700;
          color: #027a48;
        }

        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .status--pending {
          background-color: #fff3e0;
          color: #e65100;
        }

        .status--processing {
          background-color: #e3f2fd;
          color: #1565c0;
        }

        .status--shipped {
          background-color: #f3e5f5;
          color: #7b1fa2;
        }

        .status--delivered {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status--cancelled {
          background-color: #ffebee;
          color: #c62828;
        }

        .dashboard-actions {
          background: var(--st-text-white, #fff);
          border: 1px solid #e7ebf0;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
        }

        .dashboard-actions h3 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 700;
          color: var(--st-text-primary);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background-color: var(--st-background);
          border-radius: 8px;
          text-decoration: none;
          color: var(--st-text-primary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-button:hover {
          background-color: var(--st-primary);
          color: white;
        }

        .action-button__icon {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
