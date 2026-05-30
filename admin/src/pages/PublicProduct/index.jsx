import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '@Store/slices/productSlice'
import ProductCard from '@Component/ProductCard'
import Pagination from '@Component/Pagination'
import './styles.scss'
import SubHeading from '@Component/SubHeading'

export const PublicProduct = () => {
    const dispatch = useDispatch()
    const { data: products, loading, pagination } = useSelector((state) => state.product)
    
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(12)

    useEffect(() => {
        dispatch(getProducts({ 
            search: searchQuery, 
            page: currentPage, 
            per_page: pageSize 
        }))
    }, [currentPage, searchQuery, pageSize, dispatch])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    return (
        <div className="public-product-page">
            <div className="public-product-page__content">
                <SubHeading
                    title="Our Products"
                    subtitle="Browse our collection of quality products"
                />

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

                        <div className="public-product-page__pagination">
                            <Pagination
                                currentPage={currentPage}
                                total={pagination.total}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={(size) => {
                                    setPageSize(size);
                                    setCurrentPage(1);
                                }}
                                pageSizeOptions={[12, 24, 48]}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}