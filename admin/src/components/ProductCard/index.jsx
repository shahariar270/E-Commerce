import React, { useState } from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCart } from '@Store/slices/cartSlice';
import { getStockStatus } from '@utils/helper';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Cart mutations are read-modify-write on the server, so firing several
  // at once (e.g. clicking Add to Cart on multiple cards before the first
  // request lands) races and can leave the client's cart state — and the
  // header badge count — reflecting a stale intermediate response instead
  // of the final total. cartLoading guards against that globally, but it's
  // shared by every card on the page — using it to visually disable this
  // card's own button would flicker every *other* card's button too each
  // time any add-to-cart request starts/finishes. isAdding tracks just
  // this card's own in-flight request for the visual state instead.
  const cartLoading = useSelector((state) => state.cart.loading);
  const [isAdding, setIsAdding] = useState(false);
  // Cart items come back either as a raw product id string (createCart's
  // response) or a populated product object (getCart/updateCart/
  // removeFromCart all populate items.product_id) — match against both
  // shapes so the "already in cart" count stays correct regardless of
  // which action last touched the cart.
  const cartItems = useSelector((state) => state.cart.items);
  const inCartQty = cartItems.find((item) => {
    const itemProductId = typeof item.product_id === 'object' ? item.product_id?._id : item.product_id;
    return itemProductId === product._id;
  })?.quantity || 0;

  // Keyword-rich, descriptive alt text for product images (SEO + accessibility)
  const categoryName = product.category?.[0]?.name?.trim();
  const productAlt = `Buy ${product.product_name}${categoryName ? ` — ${categoryName}` : ""} online in Bangladesh`;

  const stockInfo = getStockStatus(product.stock);
  const isOutOfStock = stockInfo.key === 'out_of_stock';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (cartLoading) return;
    setIsAdding(true);
    dispatch(createCart({
      product_id: product._id,
      name: product.product_name,
      price: product.price,
      quantity: 1,
    })).finally(() => setIsAdding(false));
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
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? 'Out of Stock' : inCartQty > 0 ? `${inCartQty} in Cart` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
