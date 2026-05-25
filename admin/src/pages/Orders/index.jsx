import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, updateOrder } from "@Store/slices/orderSlice";
import Select from "@Component/Select";

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
  const dispatch = useDispatch();

  const { orders, pagination } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrder({ page: currentPage, limit: pageSize }))
  }, [dispatch, currentPage, pageSize])


  const columns = [
    {
      key: "_id",
      title: "Order ID",
      sortable: true,
      // render: (value) => (
      //   <span style={{ fontWeight: 600, color: "#1976d2" }}>{value}</span>
      // ),
    },
    {
      key: "shippingAddress.name",
      title: "Customer Name",
      render: (value, row)=>(
        <span>{row?.shippingAddress?.name}</span>
      )
    },
    {
      key: "shippingAddress.name",
      title: "Customer Phone",
      render: (value, row)=>(
        <span>{row?.shippingAddress?.phone}</span>
      )
    },
    {
      key: "totalAmount",
      title: "Customer Name",
      // render: (value, row)=>(
      //   <span>{row?.shippingAddress?.phone}</span>
      // )
    },
    {
      key: 'status',
      title: "Status",
      render: (value, row) => {
        return (
          <Select
            options={formattedOption}
            value={formattedOption.find((item) => item.value === value)}
            onChange={(option) => dispatch(updateOrder({ ...row, status: option.value })).then(() => dispatch(getAllOrder()))}
          />
        );
      }
    },
    // {
    //   key: "actions",
    //   title: "Actions",
    //   width: "120px",
    //   render: (_, row) => (
    //     <div className="table-actions">
    //       <button
    //         className="action-btn action-btn--view"
    //         onClick={() => handleView(row)}
    //         title="View Details"
    //       >
    //         👁️
    //       </button>
    //       <button
    //         className="action-btn action-btn--edit"
    //         onClick={() => handleEdit(row)}
    //         title="Edit"
    //       >
    //         ✏️
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  const handleView = (order) => {
    // Add view logic here
  };

  const handleEdit = (order) => {
    // Add edit logic here
  };

  const handleAddOrder = () => {
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
          total={pagination.total}
          striped={true}
          sortable={true}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  );
};

export default Orders;