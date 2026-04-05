import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getProductById, updateProduct } from "@Store/slices/productSlice";
import './styles.scss';
import Button from "@Component/Buttons";
import Input from "@Component/Input";

const ProductEdit = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const action = searchParams.get('action') || 'new';
  const id = searchParams.get('id');
  const product = useSelector(state => state.product.current);
  const loading = useSelector(state => state.product.loading);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: "",
    stock: "",
    category: [],
  });

  useEffect(() => {
    if (action === 'edit' && id) {
      dispatch(getProductById(id));
    }
  }, [id, action, dispatch]);

  useEffect(() => {
    if (product && action === 'edit') {
      setFormData({
        product_name: product.product_name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || [],
      });
    }
  }, [product, action]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === 'edit' && id) {
        await dispatch(updateProduct({ id, data: formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      navigate("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading && action === 'edit' && !product) {
    return <div className="product-edit">Loading...</div>;
  }

  return (
    <div className="product-edit">
      <div className="product-edit__header">
        <h2>{action === 'edit' ? "Edit Product" : "Create New Product"}</h2>
      </div>

      <form className="product-edit__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_name">Product Name</label>
          <Input
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={handleCancel}
            type="button"
          />
          <Button
            label={loading ? "Saving..." : "Save Product"}
            variant="primary"
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
