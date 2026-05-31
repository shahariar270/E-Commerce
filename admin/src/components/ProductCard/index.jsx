import React from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const getStockStatus = (stock) => {
    const statusMap = {
      in_stock: { label: 'In Stock', class: 'in-stock' },
      out_stock: { label: 'Out of Stock', class: 'out-stock' },
      coming_soon: { label: 'Coming Soon', class: 'coming-soon' },
    };
    return statusMap[stock] || { label: stock, class: '' };
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <div className="product-card">
      <div className="product-card__image">
        <div className="product-card__placeholder">
          <img height={'120px'} src={product.image_gallery?.[0] || "https://dummyimage.com/600x600/eee/999&text=No+Image"} />
        </div>
        <span className={`product-card__stock product-card__stock--${stockInfo.class}`}>
          {stockInfo.label}
        </span>
      </div>

      <div className="product-card__content">
        <div className="product-card__category">
          {product.category?.map((cat, index) => (
            <span key={index}>{cat.name}</span>
          ))}
        </div>

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
          <button className="product-card__btn" onClick={() => navigate(`/product/${product?._id}`)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;