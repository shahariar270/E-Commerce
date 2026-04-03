import React, { useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Buttons";
import './styles.scss';

const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    stock: 45,
    status: "Active",
    image: "https://picsum.photos/50/50?random=1",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    stock: 30,
    status: "Active",
    image: "https://picsum.photos/50/50?random=2",
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Sports",
    price: 79.99,
    stock: 100,
    status: "Active",
    image: "https://picsum.photos/50/50?random=3",
  },
  {
    id: 4,
    name: "Laptop Stand",
    category: "Accessories",
    price: 29.99,
    stock: 0,
    status: "Out of Stock",
    image: "https://picsum.photos/50/50?random=4",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    stock: 75,
    status: "Active",
    image: "https://picsum.photos/50/50?random=5",
  },
  {
    id: 6,
    name: "Yoga Mat",
    category: "Sports",
    price: 24.99,
    stock: 150,
    status: "Active",
    image: "https://picsum.photos/50/50?random=6",
  },
  {
    id: 7,
    name: "USB-C Hub",
    category: "Accessories",
    price: 49.99,
    stock: 20,
    status: "Active",
    image: "https://picsum.photos/50/50?random=7",
  },
  {
    id: 8,
    name: "Desk Lamp",
    category: "Home",
    price: 39.99,
    stock: 60,
    status: "Active",
    image: "https://picsum.photos/50/50?random=8",
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 25,
    status: "Active",
    image: "https://picsum.photos/50/50?random=9",
  },
  {
    id: 10,
    name: "Water Bottle",
    category: "Sports",
    price: 19.99,
    stock: 200,
    status: "Active",
    image: "https://picsum.photos/50/50?random=10",
  },
  {
    id: 11,
    name: "Monitor Stand",
    category: "Accessories",
    price: 34.99,
    stock: 40,
    status: "Active",
    image: "https://picsum.photos/50/50?random=11",
  },
  {
    id: 12,
    name: "Webcam HD",
    category: "Electronics",
    price: 89.99,
    stock: 15,
    status: "Active",
    image: "https://picsum.photos/50/50?random=12",
  },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      key: "image",
      title: "Image",
      width: "80px",
      render: (value) => (
        <img
          src={value}
          alt="Product"
          style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }}
        />
      ),
    },
    {
      key: "name",
      title: "Product Name",
      sortable: true,
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      align: "right",
      render: (value) => `$${value.toFixed(2)}`,
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
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span
          className={`status-badge status-badge--${value === "Active" ? "active" : "inactive"
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn--edit"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="action-btn action-btn--delete"
            onClick={() => handleDelete(row.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleAddProduct = () => {
    console.log("Add new product");
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div className="products-page__title">
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
          striped={true}
          sortable={true}
          emptyMessage="No products found"
        />
      </div>
    </div>
  );
};

export default Products;