import React, { useEffect, useState } from "react";
import TableContainer from "../../components/Table/TableContainer";
import Button from "../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, updateOrder } from "@Store/slices/orderSlice";
import Select from "@Component/Select";
import SubHeading from "@Component/SubHeading";
import SEO from "@Component/SEO";
import OrderDetailsModal from "./OrderDetailsModal";
import './styles.scss';

const statusOption = [
  'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
]

const formattedOption = statusOption.map((option) => ({
  label: option,
  value: option.toLowerCase()
}))

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const dispatch = useDispatch();

  const { orders, pagination, loading } = useSelector((state) => state.order);

  useEffect(() => {
    // Skip API call if we already have orders and user hasn't changed search/pagination
    // Only skip on initial page load without search
    if (hasInitialFetch && orders.length > 0 && !searchQuery && currentPage === 1 && pageSize === 10) {
      return;
    }
    
    dispatch(getAllOrder({ page: currentPage, limit: pageSize, search: searchQuery }))
    setHasInitialFetch(true);
  }, [dispatch, currentPage, pageSize, searchQuery, hasInitialFetch, orders.length])


  const columns = [
    {
      key: "_id",
      title: "Order ID",
      sortable: true,
      render: (value) => (
        <span className="order-id">#{value.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      key: "shippingAddress.name",
      title: "Customer",
      render: (_, row) => (
        <div className="customer-info">
          <div className="customer-name">{row?.shippingAddress?.name}</div>
          <div className="customer-email">{row?.email || row?.user?.email}</div>
          <div className="customer-phone">{row?.shippingAddress?.phone}</div>
        </div>
      )
    },
    {
      key: "totalAmount",
      title: "Amount",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="order-amount">${Number(value || 0).toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      title: "Status",
      render: (value, row) => {
        return (
          <div className={`status-select status-select--${value.toLowerCase()}`}>
            <Select
              options={formattedOption}
              value={formattedOption.find((item) => item.value === value.toLowerCase())}
              onChange={(option) => dispatch(updateOrder({ ...row, status: option.value })).then(() => dispatch(getAllOrder({ page: currentPage, limit: pageSize })))}
            />
          </div>
        );
      }
    },
    {
      key: "actions",
      title: "Actions",
      width: "100px",
      align: "center",
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn--view"
            onClick={() => handleView(row)}
            title="View Details"
          >
            👁️
          </button>
        </div>
      ),
    },
  ];

  const handleView = (order) => {
    setViewingOrder(order);
  };

  const handleAddOrder = () => {
    // Add new order logic here
  };

  return (
    <div className="orders-page st-page">
      <SEO title="Manage Orders" description="Manage customer orders and track deliveries." noindex />
      <SubHeading
        title="Orders"
        subtitle="Manage customer orders and track deliveries"
        rightContent={
          <Button
            label="+ New Order"
            variant="primary"
            size="md"
            onClick={handleAddOrder}
          />
        }
      />

      <TableContainer
        columns={columns}
        data={orders}
        totalItems={pagination.total}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search orders..."
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        striped={true}
        sortable={true}
        emptyMessage="No orders found"
      />

      {viewingOrder && (
        <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}
    </div>
  );
};

export default Orders;