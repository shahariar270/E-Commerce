import React from 'react';
import './styles.scss';

const ProductCard = ({ product }) => {
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
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
          <button className="product-card__btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;