import React from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createCart } from '@Store/slices/cartSlice';
import { getStockStatus } from '@utils/helper';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keyword-rich, descriptive alt text for product images (SEO + accessibility)
  const categoryName = product.category?.[0]?.name?.trim();
  const productAlt = `Buy ${product.product_name}${categoryName ? ` — ${categoryName}` : ""} online in Bangladesh`;

  const stockInfo = getStockStatus(product.stock);
  const isOutOfStock = stockInfo.key === 'out_of_stock';

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
        <span className={`product-card__stock product-card__stock--${stockInfo.key.replace(/_/g, '-')}`}>
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
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
