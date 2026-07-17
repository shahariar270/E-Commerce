import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '@Store/slices/productSlice'
import { getCategories } from '@Store/slices/categorySlice'
import ProductCard from '@Component/ProductCard'
import Pagination from '@Component/Pagination'
import Select from '@Component/Select'
import SectionHeading from '@Component/Storefront/SectionHeading'
import './styles.scss'
import SEO from '@Component/SEO'

const filterOptions = [
    { label: 'Price: High to Low', value: 'hig_to_lo' },
    { label: 'Price: Low to High', value: 'lo_to_hig' },
    { label: 'Name: A to Z', value: 'a_to_z' },
    { label: 'Name: Z to A', value: 'z_to_a' },
]

export const PublicProduct = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { data: products, loading, pagination } = useSelector((state) => state.product)
    const { categories } = useSelector((state) => state.category)

    const [searchQuery, setSearchQuery] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('search') || ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [hasInitialFetch, setHasInitialFetch] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('filter') || null
    })
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('category') || null
    })

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(getCategories({ page: 1, limit: 20 }))
        }
    }, [dispatch])

    useEffect(() => {
        // Skip API call if we already have products and no filters/search/pagination changes
        // Only skip on initial page load without search or filter
        if (hasInitialFetch && products.length > 0 && !searchQuery && !selectedFilter && !selectedCategory && currentPage === 1 && pageSize === 10) {
            return;
        }

        const fetchProducts = () => {
            dispatch(getProducts({
                search: searchQuery,
                filter: selectedFilter,
                category: selectedCategory,
                page: currentPage,
                per_page: pageSize
            }))
            setHasInitialFetch(true)
        }

        const timeoutId = setTimeout(fetchProducts, 300)
        return () => clearTimeout(timeoutId)
    }, [dispatch, searchQuery, currentPage, pageSize, selectedFilter, selectedCategory, hasInitialFetch, products.length])

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

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
        const url = new URL(window.location)
        if (categoryId) {
            url.searchParams.set('category', categoryId)
        } else {
            url.searchParams.delete('category')
        }
        window.history.replaceState({}, '', url)
    }

    const activeFilterOption = filterOptions.find(o => o.value === selectedFilter) || null
    const activeCategory = categories?.find(c => c._id === selectedCategory)

    // Build a dynamic listing title reflecting search/filter state
    const listingTitle = searchQuery
      ? `Search: ${searchQuery}`
      : activeCategory
      ? activeCategory.name
      : "All Products"

    const listingDescription = searchQuery
      ? `Search results for "${searchQuery}". Shop quality products on a trusted Bangladeshi ecommerce platform and the best ecommerce CMS for your bangladeshi ecommerce business.`
      : "Browse our full catalog of quality products. A complete bangladeshi ecommerce solution built on the best ecommerce CMS to support your bangladeshi ecommerce business."

    return (
        <div className="public-product-page">
            {/* Product listing SEO — title-wise dynamic */}
            <SEO
              title={listingTitle}
              description={listingDescription}
              keywords={[
                searchQuery ? `buy ${searchQuery} online` : "shop online Bangladesh",
                searchQuery ? `${searchQuery} price in Bangladesh` : "best products Bangladesh",
                "ecommerce CMS",
                "bangladeshi ecommerce solution",
              ]}
              type="website"
            />
            <div className="eshop-container public-product-page__content">
                <div className="public-product-page__breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span> / <span className="is-current">Products</span>
                </div>

                <SectionHeading eyebrow="Shop" title={listingTitle} />
                <p className="public-product-page__count">{pagination.total} items</p>

                <div className="public-product-page__toolbar">
                    <div className="public-product-page__pills">
                        <button
                            className={`public-product-page__pill ${!selectedCategory ? 'is-active' : ''}`}
                            onClick={() => handleCategoryChange(null)}
                        >
                            All
                        </button>
                        {categories?.map((cat) => (
                            <button
                                key={cat._id}
                                className={`public-product-page__pill ${selectedCategory === cat._id ? 'is-active' : ''}`}
                                onClick={() => handleCategoryChange(cat._id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="public-product-page__search-sort">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="public-product-page__search"
                        />
                        <Select
                            options={filterOptions}
                            value={activeFilterOption}
                            onChange={handleFilterChange}
                            isClearable={true}
                        />
                    </div>
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
