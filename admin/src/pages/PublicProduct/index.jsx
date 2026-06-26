import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '@Store/slices/productSlice'
import ProductCard from '@Component/ProductCard'
import Pagination from '@Component/Pagination'
import Select from '@Component/Select'
import './styles.scss'
import SubHeading from '@Component/SubHeading'

const filterOptions = [
    { label: 'Price: High to Low', value: 'hig_to_lo' },
    { label: 'Price: Low to High', value: 'lo_to_hig' },
    { label: 'Name: A to Z', value: 'a_to_z' },
    { label: 'Name: Z to A', value: 'z_to_a' },
]

export const PublicProduct = () => {
    const dispatch = useDispatch()
    const { data: products, loading, pagination } = useSelector((state) => state.product)

    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [selectedFilter, setSelectedFilter] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('filter') || null
    })
    const [hasFetched, setHasFetched] = useState(false)

    useEffect(() => {
        if (hasFetched && products.length > 0) return;
        const fetchProducts = () => {
            dispatch(getProducts({
                search: searchQuery,
                filter: selectedFilter,
                page: currentPage,
                per_page: pageSize
            }))
            setHasFetched(true)
        }

        const timeoutId = setTimeout(fetchProducts, 300)
        return () => clearTimeout(timeoutId)
    }, [dispatch, searchQuery, currentPage, pageSize, products, selectedFilter, hasFetched])

    const handleFilterChange = (option) => {
        const value = option?.value || null
        setSelectedFilter(value)
        setCurrentPage(1)
        const url = new URL(window.location)
        if (value) {
            url.searchParams.set('filter', value)
        } else {
            url.searchParams.delete('filter')
        }
        window.history.replaceState({}, '', url)
    }

    const activeFilterOption = filterOptions.find(o => o.value === selectedFilter) || null

    return (
        <div className="public-product-page">
            <div className="public-product-page__content">
                <SubHeading
                    title="Our Products"
                    subtitle="Browse our collection of quality products"
                />

                <div className="public-product-page__filters">
                    <Select
                        options={filterOptions}
                        value={activeFilterOption}
                        onChange={handleFilterChange}
                        label="Sort by"
                        isClearable={true}
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
                                pageSizeOptions={[10, 20, 50]}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}