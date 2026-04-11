import { getProductById } from '@Store/slices/productSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom'

export const ProductSinge = () => {
    const { id } = useParams();
    const { current } = useSelector(state => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProductById(id))
    }, [])

    return (
        <div className="product-single-container">
            {current ? (
                <div className="product-single-card">
                    <div className="product-single-image">
                        <img src={current.image} alt={current.name} className="product-image" />
                    </div>
                    <div className="product-single-details">
                        <h1 className="product-title">{current.name}</h1>
                        <p className="product-price">${current.price}</p>
                        <p className="product-description">{current.description}</p>
<div className="product-meta">
                            <span className="product-stock">Stock: {current.stock}</span>
                        </div>
                        <div className="product-quantity-section">
                            <label htmlFor="quantity" className="product-quantity-label">Quantity:</label>
                            {/* <select id="quantity" className="product-quantity-select" value={qty} onChange={e=>setQty(parseInt(e.target.value))}>
                                {[...Array(Math.min(10, current.stock)).keys()].map(i=>(
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                ))}
                            </select> */}
                        </div>
                        <div className="product-action-buttons">
                            <button className="btn btn-primary" onClick={() => dispatch(addToCart({id: current.id, qty}))}>Add to Cart</button>
                            <button className="btn btn-secondary" onClick={() => dispatch(buyNow({id: current.id, qty}))}>Buy Now</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading-message">Loading product...</div>
            )}
            {current && current.related && current.related.length > 0 && (
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

        </div>
    )
}
