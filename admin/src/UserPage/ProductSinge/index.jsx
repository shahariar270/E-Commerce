import Button from '@Component/Buttons';
import Tab from '@Component/Tab';
import { getProductById } from '@Store/slices/productSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.scss';
import { createCart } from '@Store/slices/cartSlice';
import { Comments } from '@Component/Comments';
import { createReview } from '@Store/slices/reviewSlice';

export const ProductSinge = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { current, loading } = useSelector(state => state.product);
    const { loading: reviewLoading, latest: latestReview } = useSelector(state => state.review);
    const { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(current?.image_gallery?.[0]);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: '',
    });

    const increaseQty = () => setQuantity(prev => prev + 1);

    const decreaseQty = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    useEffect(() => {
        dispatch(getProductById(id));
    }, []);

    if (!current && loading) {
        return <div className="loading-message">Loading product...</div>;
    }

    const handleCart = (quantity) => {
        dispatch(createCart({
            product_id: current._id,
            name: current.product_name,
            price: current.price,
            quantity
        })).then((res) => {
            navigate('/wishlist');
        })
    }

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

        if (!reviewForm.comment.trim()) return;

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
        }).catch(() => {});
    };

    useEffect(() => {
        if (current?.image_gallery?.length > 0) {
            setActiveImage(current.image_gallery[0]);
        }
    }, [current]);

    return (
        <div className="product-single-container">
            {current ? (
                <>
                    <div className="st-single-product">
                        <div className="product-image-wrapper">
                            <img src={activeImage || 'https://dummyimage.com/600x600/eee/999&text=No+Image'} />
                            <div className="image-thumbnails">
                                {current.image_gallery?.length > 1 && current.image_gallery.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        onClick={() => setActiveImage(img)}
                                        className={activeImage === img ? 'active' : ''}
                                        width={'40px'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="product-details">
                            {/* <h4>{current.category || 'Category'}</h4> */}
                            <h2>{current.product_name}</h2>
                            <p className="price">Price: ${current.price} </p>
                            <div className="st-category-pill">
                                <p>Category: </p>
                                {current.category && current.category.map((cat) => (
                                    <span key={cat._id}>{cat.name}</span>
                                ))}
                            </div>

                            <div className="button-group">
                                <div className="quantity-box">
                                    <button onClick={decreaseQty}>-</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        min="1"
                                    />
                                    <button onClick={increaseQty}>+</button>
                                </div>
                                <Button
                                    label="Add to Cart"
                                    onClick={() => handleCart(quantity)}
                                />
                                <Button label="Buy Now" />

                            </div>
                        </div>
                    </div>

                    <div className="tab-container">
                        <Tab
                            link={true}
                            variant='underline'
                            tabs={[
                                {
                                    label: 'Description',
                                    content: <div className="tab-content">{current.description}</div>
                                },
                                {
                                    label: 'Reviews and Ratings',
                                    content: (
                                        <div className="tab-content">
                                            <div className="st-review-panel">
                                                <h3>Write a Review</h3>
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
                                                                <span>★</span>
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
                                                        label={reviewLoading ? 'Submitting...' : 'Submit Review'}
                                                        type="submit"
                                                        disabled={reviewLoading || !reviewForm.comment.trim()}
                                                    />
                                                </form>
                                                {latestReview?.product === current._id && (
                                                    <p className="st-review-success">Your review was submitted.</p>
                                                )}
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
            )
            }
        </div >
    );
};
