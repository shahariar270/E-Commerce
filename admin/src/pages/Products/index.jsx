import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../components/Table/TableContainer";
import Button from "../../components/Buttons";
import './styles.scss';
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "@Store/slices/productSlice";
import SubHeading from "@Component/SubHeading";
import { sliceString, getStockStatus } from "@utils/helper";
import Tooltip from "@Component/Tooltip";


const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(state => state.product.data);
  const total = useSelector(state => state.product.pagination.total);
  const loading = useSelector(state => state.product.loading);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  useEffect(() => {
    // Skip API call if we already have products and user hasn't changed search/filters
    // Only skip on initial page load without search
    if (hasInitialFetch && products.length > 0 && !searchQuery && currentPage === 1 && pageSize === 10) {
      return;
    }

    const fetchProducts = () => {
      dispatch(getProducts({ search: searchQuery, page: currentPage, per_page: pageSize }));
      setHasInitialFetch(true);
    }

    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, pageSize, dispatch, hasInitialFetch, products.length]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };
  const handleEdit = (product) => {
    navigate(`/admin/product/${product._id}`);
  };

  const handleAddProduct = () => {
    navigate('/admin/product/new');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "product_name",
      title: "Product Name",
      sortable: true,
      render: (value, row) => (
        <div className="product-info">
          <Tooltip content={value}>
            <span 
              style={{ cursor: 'pointer', fontWeight: 500 }} 
              onClick={() => navigate(`/admin/product/${row._id}`)} 
              className="st-text-capitalize"
            >
              {sliceString(value, 30)}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      render: (value) => (
        <div className="st-category-list">
          {value?.map((cat, index) => (
            <span key={index} className="category-tag">{cat.name}</span>
          ))}
        </div>
      )
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      align: "right",
      render: (value) => (
        <span style={{ fontWeight: 600 }}>${Number(value || 0).toFixed(2)}</span>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      sortable: true,
      align: "center",
      render: (value) => {
        const stockInfo = getStockStatus(value);
        const modifier = { in_stock: 'in', low_stock: 'low', out_of_stock: 'out' }[stockInfo.key];

        return (
          <span className={`stock-badge stock-badge--${modifier}`}>
            {stockInfo.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "150px",
      align: "center",
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn--view"
            onClick={() => window.open(`/product/${row._id}`, '_blank')}
            title="View on site"
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
          <button
            className="action-btn action-btn--delete"
            onClick={() => handleDelete(row._id)}
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
      <SubHeading
        title="Products"
        subtitle="Manage your product inventory"
        rightContent={
          <Button
            label="+ Add New Product"
            variant="primary"
            size="md"
            onClick={handleAddProduct}
          />
        }
      />

      <TableContainer
        columns={columns}
        data={products}
        totalItems={total}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search products..."
        searchQuery={searchQuery}
        onSearch={handleSearch}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        striped={true}
        sortable={true}
        emptyMessage="No products found"
      />
    </div>
  );
};

export default Products;