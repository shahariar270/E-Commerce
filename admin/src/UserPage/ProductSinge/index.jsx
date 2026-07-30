import Button from '@Component/Buttons';
import Tab from '@Component/Tab';
import { getProductById } from '@Store/slices/productSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.scss';
import { createCart } from '@Store/slices/cartSlice';
import { Comments } from '@Component/Comments';
import { createReview, getReviews } from '@Store/slices/reviewSlice';
import SEO from '@Component/SEO';
import {
  productDescription,
  productKeywords,
  productJsonLd,
  productBreadcrumbJsonLd,
} from '@utils/seo';
import { getStockStatus } from '@utils/helper';

const normalizeProductId = (product) => {
    if (!product) return null;
    return typeof product === 'object' ? product._id : product;
};

const getAuthorName = (author) => {
    if (!author) return 'Verified customer';
    return author.user_name || author.name || 'Verified customer';
};

const renderStars = (rating, className = '') => (
    <span className={`st-stars ${className}`.trim()} aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= Math.round(rating) ? 'is-filled' : ''} aria-hidden="true">
                &#9733;
            </span>
        ))}
    </span>
);

export const ProductSinge = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { current, loading } = useSelector(state => state.product);
    const {
        reviews,
        loading: reviewsLoading,
        creating: reviewCreating,
        latest: latestReview,
        error: reviewError,
    } = useSelector(state => state.review);
    const { token } = useSelector(state => state.auth);
    const cartLoading = useSelector(state => state.cart.loading);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(current?.image_gallery?.[0]);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: '',
    });

    const productReviews = reviews.filter((review) => normalizeProductId(review.product) === current?._id);
    const averageRating = productReviews.length
        ? productReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / productReviews.length
        : 0;

    const increaseQty = () => setQuantity(prev => (current?.stock ? Math.min(prev + 1, current.stock) : prev + 1));

    const decreaseQty = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    useEffect(() => {
        // Only fetch if the product ID has changed or if no product is loaded
        if (current?._id !== id) {
            dispatch(getProductById(id));
        }
        // Only fetch reviews if the list is empty
        if (reviews.length === 0) {
            dispatch(getReviews());
        }
    }, [dispatch, id, current?._id, reviews.length]);

    useEffect(() => {
        if (current?.image_gallery?.length > 0) {
            setActiveImage(current.image_gallery[0]);
        }
    }, [current]);

    if (!current && loading) {
        return <div className="loading-message">Loading product...</div>;
    }

    const stockInfo = getStockStatus(current?.stock);
    const isOutOfStock = stockInfo.key === 'out_of_stock';

    const handleCart = (cartQuantity) => {
        dispatch(createCart({
            product_id: current._id,
            name: current.product_name,
            price: current.price,
            quantity: cartQuantity
        })).then(() => {
            navigate('/cart');
        });
    };

    const handleBuyNow = (cartQuantity) => {
        dispatch(createCart({
            product_id: current._id,
            name: current.product_name,
            price: current.price,
            quantity: cartQuantity
        })).then(() => {
            navigate('/checkout');
        });
    };

    const handleReviewChange = (event) => {
        const { name, value } = event.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: name === 'rating' ? Number(value) : value,
        }));
    };

    const handleReviewSubmit = (event) => {
        event.preventDefault();

        if (!token) {
            navigate('/login');
            return;
        }

        if (!reviewForm.comment.trim() || reviewCreating) return;

        dispatch(createReview({
            productId: current._id,
            rating: reviewForm.rating,
            title: reviewForm.title.trim(),
            comment: reviewForm.comment.trim(),
        })).unwrap().then(() => {
            setReviewForm({
                rating: 5,
                title: '',
                comment: '',
            });
        }).catch(() => { });
    };

    return (
        <div className="product-single-container">
            {current ? (
                <>
                    {/* Per-product title-wise SEO with structured data */}
                    <SEO
                      title={current.product_name}
                      description={productDescription(current)}
                      keywords={productKeywords(current)}
                      image={current.image_gallery?.[0]}
                      url={typeof window !== "undefined" ? `${window.location.origin}/product/${current._id}` : undefined}
                      type="product"
                      jsonLd={[
                        productJsonLd(current, { reviews: productReviews, averageRating }),
                        productBreadcrumbJsonLd(current),
                      ]}
                    />
                    <div className="st-single-product">
                        <div className="product-image-wrapper">
                            <img
                                src={activeImage || 'https://dummyimage.com/600x600/eee/999&text=No+Image'}
                                alt={current.product_name}
                            />
                            <div className="image-thumbnails">
                                {current.image_gallery?.length > 1 && current.image_gallery.map((img, index) => (
                                    <button
                                        type="button"
                                        key={img}
                                        onClick={() => setActiveImage(img)}
                                        className={activeImage === img ? 'active' : ''}
                                        aria-label={`View product image ${index + 1}`}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="product-details">
                            <h2>{current.product_name}</h2>
                            <p className="price">Price: ${current.price}</p>
                            <span className={`product-single__stock product-single__stock--${stockInfo.key.replace(/_/g, '-')}`}>
                                {stockInfo.label}
                            </span>
                            <div className="st-category-pill">
                                <p>Category:</p>
                                {current.category && current.category.map((cat) => (
                                    <span key={cat._id || cat.id || cat.slug}>{cat.name}</span>
                                ))}
                            </div>

                            {(current.brand || current.sku || current.warranty) && (
                                <ul className="product-highlights">
                                    {current.brand && (
                                        <li><span>Brand</span>{current.brand}</li>
                                    )}
                                    {current.sku && (
                                        <li><span>SKU</span>{current.sku}</li>
                                    )}
                                    {current.warranty && (
                                        <li><span>Warranty</span>{current.warranty}</li>
                                    )}
                                </ul>
                            )}

                            <div className="button-group">
                                <div className="quantity-box">
                                    <button type="button" onClick={decreaseQty} disabled={isOutOfStock}>-</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const next = Math.max(1, Number(e.target.value) || 1);
                                            setQuantity(current.stock ? Math.min(next, current.stock) : next);
                                        }}
                                        min="1"
                                        max={current.stock || undefined}
                                        disabled={isOutOfStock}
                                    />
                                    <button type="button" onClick={increaseQty} disabled={isOutOfStock || quantity >= current.stock}>+</button>
                                </div>
                                <Button
                                    label={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                    onClick={() => handleCart(quantity)}
                                    disabled={isOutOfStock || cartLoading}
                                />
                                <Button
                                    label="Buy Now"
                                    variant="secondary"
                                    onClick={() => handleBuyNow(quantity)}
                                    disabled={isOutOfStock || cartLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="tab-container">
                        <Tab  
                            link={true}
                            variant="underline"
                            tabs={[
                                {
                                    label: 'Description',
                                    content: <div className="tab-content">{current.description}</div>
                                },
                                {
                                    label: 'Reviews and Ratings',
                                    content: (
                                        <div className="tab-content">
                                            <div className="st-review-section">
                                                <div className="st-review-summary">
                                                    <div>
                                                        <span className="st-review-summary__score">
                                                            {averageRating ? averageRating.toFixed(1) : '0.0'}
                                                        </span>
                                                        {renderStars(averageRating, 'st-review-summary__stars')}
                                                    </div>
                                                    <p>
                                                        {productReviews.length
                                                            ? `Based on ${productReviews.length} customer review${productReviews.length > 1 ? 's' : ''}`
                                                            : 'No reviews yet for this product'}
                                                    </p>
                                                </div>

                                                <div className="st-review-grid">
                                                    <div className="st-review-list" aria-live="polite">
                                                        <div className="st-review-list__header">
                                                            <h3>Customer Reviews</h3>
                                                            <span>{productReviews.length} total</span>
                                                        </div>

                                                        {reviewsLoading && productReviews.length === 0 ? (
                                                            <div className="st-review-empty">Loading reviews...</div>
                                                        ) : productReviews.length === 0 ? (
                                                            <div className="st-review-empty">Be the first customer to share a review.</div>
                                                        ) : (
                                                            productReviews.map((review) => (
                                                                <article className="st-review-card" key={review._id}>
                                                                    <div className="st-review-card__header">
                                                                        <div className="st-review-avatar">
                                                                            {getAuthorName(review.author).charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <h4>{getAuthorName(review.author)}</h4>
                                                                            {renderStars(review.rating)}
                                                                        </div>
                                                                    </div>
                                                                    {review.title && <h5>{review.title}</h5>}
                                                                    <p>{review.comment}</p>
                                                                </article>
                                                            ))
                                                        )}
                                                    </div>

                                                    <div className="st-review-panel">
                                                        <h3>Write a Review</h3>
                                                        <p className="st-review-panel__hint">Share what stood out after using this product.</p>
                                                        <form className="st-review-form" onSubmit={handleReviewSubmit}>
                                                            <div className="st-review-rating" role="radiogroup" aria-label="Product rating">
                                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                                    <label key={rating} className={rating <= reviewForm.rating ? 'active' : ''}>
                                                                        <input
                                                                            type="radio"
                                                                            name="rating"
                                                                            value={rating}
                                                                            checked={reviewForm.rating === rating}
                                                                            onChange={handleReviewChange}
                                                                        />
                                                                        <span aria-hidden="true">&#9733;</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            <input
                                                                className="st-review-input"
                                                                type="text"
                                                                name="title"
                                                                placeholder="Review title"
                                                                maxLength="100"
                                                                value={reviewForm.title}
                                                                onChange={handleReviewChange}
                                                            />
                                                            <textarea
                                                                className="st-text-area st-review-textarea"
                                                                name="comment"
                                                                placeholder="Share your product experience"
                                                                maxLength="1000"
                                                                value={reviewForm.comment}
                                                                onChange={handleReviewChange}
                                                                required
                                                            />
                                                            <Button
                                                                label={reviewCreating ? 'Submitting...' : 'Submit Review'}
                                                                type="submit"
                                                                disabled={reviewCreating || !reviewForm.comment.trim()}
                                                            />
                                                        </form>
                                                        {latestReview && normalizeProductId(latestReview.product) === current._id && (
                                                            <p className="st-review-success">Your review was submitted.</p>
                                                        )}
                                                        {reviewError && <p className="st-review-error">{reviewError}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    label: 'Product Q/A',
                                    content: <div className="tab-content">
                                        <Comments productId={current._id} />
                                    </div>
                                },
                            ]}
                        />
                    </div>

                    {current.related && current.related.length > 0 && (
                        <div className="related-products-section">
                            <h2>Related Products</h2>
                            <div className="related-products-scroll">
                                {current.related.map(product => (
                                    <div key={product.id} className="related-product-card">
                                        <img src={product.image} alt={product.name} className="related-product-image" />
                                        <h3>{product.name}</h3>
                                        <p>${product.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="loading-message">Product not found.</div>
            )}
        </div>
    );
};
