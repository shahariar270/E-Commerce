import React from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createCart } from '@Store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keyword-rich, descriptive alt text for product images (SEO + accessibility)
  const categoryName = product.category?.[0]?.name?.trim();
  const productAlt = `Buy ${product.product_name}${categoryName ? ` — ${categoryName}` : ""} online in Bangladesh`;

  const getStockStatus = (stock) => {
    const statusMap = {
      in_stock: { label: 'In Stock', class: 'in-stock' },
      out_stock: { label: 'Out of Stock', class: 'out-stock' },
      coming_soon: { label: 'Coming Soon', class: 'coming-soon' },
    };
    return statusMap[stock] || { label: stock, class: '' };
  };

  const stockInfo = getStockStatus(product.stock);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(createCart({
      product_id: product._id,
      name: product.product_name,
      price: product.price,
      quantity: 1,
    }));
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product?._id}`)}>
      <div className="product-card__image">
        <img
          height={'120px'}
          src={product.image_gallery?.[0] || "https://dummyimage.com/600x600/eee/999&text=No+Image"}
          alt={productAlt}
          loading="lazy"
        />
        {categoryName && <span className="product-card__category-pill">{categoryName}</span>}
        <span className={`product-card__stock product-card__stock--${stockInfo.class}`}>
          {stockInfo.label}
        </span>
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.product_name}</h3>

        <p className="product-card__description">
          {product.description?.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description || 'No description available'}
        </p>

        <div className="product-card__footer">
          <span className="product-card__price">
            {product.price ? `$${product.price}` : 'Price not available'}
          </span>
          <button
            className="product-card__btn"
            disabled={product.stock === 'out_stock'}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
