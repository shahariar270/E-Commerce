import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "@Store/slices/notificationSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showNotification({
      message: "Welcome back! Dashboard loaded successfully.",
      type: "success",
      delay: 3000
    }));
  }, [dispatch]);
  // Mock data for dashboard
  const stats = [
    { label: "Total Revenue", value: "$45,231", change: "+12%", positive: true },
    { label: "Total Orders", value: "1,234", change: "+8%", positive: true },
    { label: "Total Products", value: "156", change: "+3%", positive: true },
    { label: "Total Customers", value: "8,921", change: "+15%", positive: true },
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
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__content">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{stat.value}</span>
            </div>
            <div className={`stat-card__change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
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
          &__header {
            margin-bottom: 24px;
          }

          &__title {
            h2 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
              color: var(--st-text-primary);
            }

            p {
              margin: 4px 0 0;
              font-size: 14px;
              color: #666;
            }
          }
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          &__content {
            display: flex;
            flex-direction: column;
          }

          &__label {
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
          }

          &__value {
            font-size: 24px;
            font-weight: 700;
            color: var(--st-text-primary);
          }

          &__change {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;

            &.positive {
              background-color: #e8f5e9;
              color: #2e7d32;
            }

            &.negative {
              background-color: #ffebee;
              color: #c62828;
            }
          }
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;

          &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--st-border);

            h3 {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: var(--st-text-primary);
            }
          }

          &__link {
            font-size: 13px;
            color: var(--st-primary);
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          &__content {
            padding: 0;
          }
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;

          th, td {
            padding: 12px 20px;
            text-align: left;
          }

          th {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            background-color: #f8f9fa;
          }

          td {
            font-size: 14px;
            color: var(--st-text-primary);
            border-bottom: 1px solid var(--st-border);

            &:last-child {
              border-bottom: none;
            }
          }

          tr:last-child td {
            border-bottom: none;
          }

          .order-id {
            font-weight: 600;
            color: var(--st-primary);
          }

          .order-total {
            font-weight: 600;
          }

          .revenue {
            font-weight: 600;
            color: #2e7d32;
          }
        }

        .status {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;

          &--pending {
            background-color: #fff3e0;
            color: #e65100;
          }

          &--processing {
            background-color: #e3f2fd;
            color: #1565c0;
          }

          &--shipped {
            background-color: #f3e5f5;
            color: #7b1fa2;
          }

          &--delivered {
            background-color: #e8f5e9;
            color: #2e7d32;
          }

          &--cancelled {
            background-color: #ffebee;
            color: #c62828;
          }
        }

        .dashboard-actions {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          h3 {
            margin: 0 0 16px;
            font-size: 16px;
            font-weight: 600;
            color: var(--st-text-primary);
          }
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

          &:hover {
            background-color: var(--st-primary);
            color: white;
          }

          &__icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;