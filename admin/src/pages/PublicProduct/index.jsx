import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '@Store/slices/productSlice'
import ProductCard from '@Component/ProductCard'
import './styles.scss'

export const PublicProduct = () => {
    const dispatch = useDispatch()
    const { data: products, loading, pagination } = useSelector((state) => state.product)
    
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 12

    useEffect(() => {
        dispatch(getProducts({ 
            search: searchQuery, 
            page: currentPage, 
            per_page: perPage 
        }))
    }, [currentPage, searchQuery, dispatch])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const totalPages = Math.ceil((pagination?.total || 0) / perPage);

    return (
        <div className="public-product-page">
            <div className="public-product-page__content">
                <div className="public-product-page__header">
                    <h1>Our Products</h1>
                    <p>Browse our collection of quality products</p>
                </div>

                <div className="public-product-page__search">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="st-input"
                    />
                </div>

                {loading ? (
                    <div className="public-product-page__loading">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="public-product-page__empty">
                        <p>No products found</p>
                    </div>
                ) : (
                    <>
                        <div className="public-product-page__grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="public-product-page__pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}