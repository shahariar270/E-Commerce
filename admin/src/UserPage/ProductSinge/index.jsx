import Button from '@Component/Buttons';
import Tab from '@Component/Tab';
import { getProductById } from '@Store/slices/productSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './styles.scss';
import { createCart } from '@Store/slices/cartSlice';

export const ProductSinge = () => {
    const { id } = useParams();
    const { current, loading } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

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
        }))
    }

    return (
        <div className="product-single-container">
            {current ? (
                <>
                    <div className="st-single-product">
                        <div className="product-image-wrapper">
                            <img
                                src={current.image || 'https://dummyimage.com/600x600/eee/999&text=No+Image'}
                                alt={current.title}
                            />
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
                                    content: <div className="tab-content">No reviews yet.</div>
                                },
                                {
                                    label: 'Product Q/A',
                                    content: <div className="tab-content">Have a question? Ask below.</div>
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