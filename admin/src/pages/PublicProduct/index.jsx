import Button from '@Component/Buttons'
import { Topbar } from '@Component/Topbar'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@utils/api'
import ProductCard from '@Component/ProductCard'
import './styles.scss'

export const PublicProduct = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 12

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (searchQuery) params.append('search', searchQuery)
            params.append('page', currentPage)
            params.append('per_page', perPage)

            const response = await apiClient(`/products?${params.toString()}`)
            setProducts(response.data || [])
            setTotal(response.total || 0)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [currentPage, searchQuery])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const totalPages = Math.ceil(total / perPage)

    return (
        <div className="public-product-page">
            <Topbar leftContent={
                <div className='st-flex st-gap-2'>
                    <Button onClick={() => navigate('/login')} label='login' />
                    <Button onClick={() => navigate('/register')} label='Register' />
                </div>
            } />

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