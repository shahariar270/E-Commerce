import React, { useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Buttons";

// Mock orders data
const initialOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john.smith@email.com",
    total: 299.99,
    items: 3,
    status: "Pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    total: 149.99,
    items: 2,
    status: "Processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Brown",
    email: "mike.brown@email.com",
    total: 599.99,
    items: 5,
    status: "Shipped",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily.d@email.com",
    total: 89.99,
    items: 1,
    status: "Delivered",
    date: "2024-01-12",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    email: "d.wilson@email.com",
    total: 449.99,
    items: 4,
    status: "Cancelled",
    date: "2024-01-11",
  },
  {
    id: "ORD-006",
    customer: "Lisa Anderson",
    email: "l.anderson@email.com",
    total: 199.99,
    items: 2,
    status: "Pending",
    date: "2024-01-10",
  },
  {
    id: "ORD-007",
    customer: "Robert Taylor",
    email: "r.taylor@email.com",
    total: 379.99,
    items: 3,
    status: "Processing",
    date: "2024-01-09",
  },
  {
    id: "ORD-008",
    customer: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    total: 129.99,
    items: 1,
    status: "Shipped",
    date: "2024-01-08",
  },
  {
    id: "ORD-009",
    customer: "Thomas Garcia",
    email: "t.garcia@email.com",
    total: 249.99,
    items: 2,
    status: "Delivered",
    date: "2024-01-07",
  },
  {
    id: "ORD-010",
    customer: "Amanda Martinez",
    email: "a.martinez@email.com",
    total: 549.99,
    items: 4,
    status: "Processing",
    date: "2024-01-06",
  },
  {
    id: "ORD-011",
    customer: "Chris Robinson",
    email: "c.robinson@email.com",
    total: 179.99,
    items: 2,
    status: "Pending",
    date: "2024-01-05",
  },
  {
    id: "ORD-012",
    customer: "Michelle Clark",
    email: "m.clark@email.com",
    total: 399.99,
    items: 3,
    status: "Shipped",
    date: "2024-01-04",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Table columns configuration
  const columns = [
    {
      key: "id",
      title: "Order ID",
      sortable: true,
      render: (value) => (
        <span style={{ fontWeight: 600, color: "#1976d2" }}>{value}</span>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      sortable: true,
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "items",
      title: "Items",
      align: "center",
      render: (value) => <span>{value} items</span>,
    },
    {
      key: "total",
      title: "Total",
      sortable: true,
      align: "right",
      render: (value) => (
        <span style={{ fontWeight: 600 }}>${value.toFixed(2)}</span>
      ),
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => {
        const statusConfig = {
          Pending: { class: "pending", label: "Pending" },
          Processing: { class: "processing", label: "Processing" },
          Shipped: { class: "shipped", label: "Shipped" },
          Delivered: { class: "delivered", label: "Delivered" },
          Cancelled: { class: "cancelled", label: "Cancelled" },
        };
        const config = statusConfig[value] || statusConfig.Pending;
        return (
          <span className={`order-status order-status--${config.class}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn--view"
            onClick={() => handleView(row)}
            title="View Details"
          >
            👁️
          </button>
          <button
            className="action-btn action-btn--edit"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            ✏️
          </button>
        </div>
      ),
    },
  ];

  const handleView = (order) => {
    // Add view logic here
  };

  const handleEdit = (order) => {
    console.log("Edit order:", order);
    // Add edit logic here
  };

  const handleAddOrder = () => {
    console.log("Add new order");
    // Add new order logic here
  };

  return (
    <div className="orders-page st-page">
      <div className="orders-page__header st-page__header">
        <div className="orders-page__title st-page__title">
          <h2>Orders</h2>
          <p>Manage customer orders and track deliveries</p>
        </div>
        <Button
          label="+ New Order"
          variant="primary"
          size="md"
          onClick={handleAddOrder}
        />
      </div>

      {/* Order Stats */}
      <div className="orders-page__stats">
        <div className="stat-card stat-card--total">
          <span className="stat-card__value">{stats.total}</span>
          <span className="stat-card__label">Total Orders</span>
        </div>
        <div className="stat-card stat-card--pending">
          <span className="stat-card__value">{stats.pending}</span>
          <span className="stat-card__label">Pending</span>
        </div>
        <div className="stat-card stat-card--processing">
          <span className="stat-card__value">{stats.processing}</span>
          <span className="stat-card__label">Processing</span>
        </div>
        <div className="stat-card stat-card--shipped">
          <span className="stat-card__value">{stats.shipped}</span>
          <span className="stat-card__label">Shipped</span>
        </div>
        <div className="stat-card stat-card--delivered">
          <span className="stat-card__value">{stats.delivered}</span>
          <span className="stat-card__label">Delivered</span>
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          data={orders}
          searchable={true}
          searchPlaceholder="Search orders..."
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          pagination={true}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          striped={true}
          sortable={true}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  );
};

export default Orders;