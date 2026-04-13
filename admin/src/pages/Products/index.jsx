import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import Button from "../../components/Buttons";
import './styles.scss';
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "@Store/slices/productSlice";


const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(state => state.product.data);
  const total = useSelector(state => state.product.pagination.total);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getProducts({ search: searchQuery, page: currentPage, per_page: pageSize }));
  }, [searchQuery, currentPage, pageSize, dispatch])

  const handleDelete = (id) => {
    dispatch(deleteProduct(id))
  };
  const handleEdit = (product) => {
    navigate(`/admin/product/${product._id}`);
  };

  const handleAddProduct = () => {
    navigate('/admin/product/new');
  };

  const columns = [
    {
      key: "product_name",
      title: "Product Name",
      sortable: true,
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      render: (row) => (
        <div className="st-category-item">
          {
            row.map(i => (
              <span>{i.name}</span>
            ))
          }
        </div>
      )
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      align: "right",
      // render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock",
      title: "Stock",
      sortable: true,
      align: "center",
      render: (value, row) => (
        <span
          style={{
            color: value === 0 ? "#b00020" : value < 20 ? "#ff9800" : "#4caf50",
            fontWeight: 500,
          }}
          className="st-text-capitalize"
        >
          {value && value.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      render: (row, value) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn--edit"
            onClick={() => handleEdit(value)}
            title="Edit"
          >
            ✏️
          </button>

          <button
            className="action-btn action-btn--delete"
            onClick={() => handleDelete(value._id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="products-page st-page">
      <div className="products-page__header st-page__header">
        <div className="products-page__title st-page__title">
          <h2>Products</h2>
          <p>Manage your product inventory</p>
        </div>
        <Button
          label="+ Add New Product"
          variant="primary"
          size="md"
          onClick={handleAddProduct}
        />
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          data={products}
          searchable={true}
          searchPlaceholder="Search products..."
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          pagination={true}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          total={total}
          striped={true}
          sortable={true}
          emptyMessage="No products found"
        />
      </div>
    </div>
  );
};

export default Products;