import Button from '@Component/Buttons';
import Tab from '@Component/Tab';
import { getProductById } from '@Store/slices/productSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './styles.scss';

export const ProductSinge = () => {
    const { id } = useParams();
    const { current, loading } = useSelector(state => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProductById(id));
    }, [id, dispatch]);

    if (!current && loading) {
        return <div className="loading-message">Loading product...</div>;
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
                            <h2>{current.title}</h2>
                            <p className="price">${current.price}</p>

                            <div className="button-group">
                                <Button label='Buy Now' />
                                <Button label='Add to Cart' />
                            </div>
                        </div>
                    </div>

                    <div className="tab-container">
                        <Tab
                            link={true}
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
            )}
        </div>
    );
};