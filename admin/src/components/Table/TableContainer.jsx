import React, { useState, useMemo } from 'react';
import Table from '.';

const TableContainer = ({
    title,
    description,
    children,
    className = '',
    // Table props
    columns = [],
    data = [],
    onRowClick,
    sortable = false,
    striped = true,
    bordered = false,
    compact = false,
    responsive = true,
    loading = false,
    emptyMessage = 'No data available',
    // Pagination props
    pagination = true,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    // Filter props
    showFilters = false,
    filterableColumns = [],
    // Search props
    searchable = false,
    searchPlaceholder = 'Search...',
    // Callback for data changes
    onDataChange,
    ...props
}) => {
    // Internal state for pagination, search, and filters
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle page size change
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (query, filterData = filters) => {
        setSearchQuery(query);
        setCurrentPage(1);
        
        // Notify parent if callback provided
        if (onDataChange) {
            onDataChange({
                page: 1,
                pageSize: size,
                search: query,
                filters: filterData
            });
        }
    };

    // Handle filter change
    const handleFilterChange = (filterKey, filterValue) => {
        const newFilters = { ...filters, [filterKey]: filterValue };
        setFilters(newFilters);
        setCurrentPage(1);

        // Notify parent if callback provided
        if (onDataChange) {
            onDataChange({
                page: 1,
                pageSize: pageSize,
                search: searchQuery,
                filters: newFilters
            });
        }
    };

    // Reset all filters
    const handleReset = () => {
        setCurrentPage(1);
        setSearchQuery('');
        setFilters({});

        if (onDataChange) {
            onDataChange({
                page: 1,
                pageSize: pageSize,
                search: '',
                filters: {}
            });
        }
    };

    return (
        <div className={`table-container ${className}`}>
            {(title || description) && (
                <div className="table-container__header">
                    {title && <h3 className="table-container__title">{title}</h3>}
                    {description && <p className="table-container__description">{description}</p>}
                </div>
            )}
            {children || (
                <Table
                    columns={columns}
                    data={data}
                    onRowClick={onRowClick}
                    sortable={sortable}
                    striped={striped}
                    bordered={bordered}
                    compact={compact}
                    responsive={responsive}
                    loading={loading}
                    emptyMessage={emptyMessage}
                    pagination={pagination}
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={pageSizeOptions}
                    showFilters={showFilters}
                    filterableColumns={filterableColumns}
                    searchable={searchable}
                    searchPlaceholder={searchPlaceholder}
                    // Internal state
                    currentPage={currentPage}
                    pageSize={pageSize}
                    searchQuery={searchQuery}
                    filters={filters}
                    // Handlers
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onSearch={(query, filterData) => handleSearch(query, filterData)}
                    {...props}
                />
            )}
        </div>
    );
};

export default TableContainer;
