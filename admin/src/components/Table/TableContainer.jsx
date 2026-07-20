import React, { useState, useEffect, useCallback } from 'react';
import Table from '.';
import Pagination from './Pagination';
import SearchInput from './SearchInput';

const TableContainer = ({
    columns = [],
    data = [],
    totalItems = 0,
    loading = false,
    onDataChange,
    renderHeader,
    renderFooter,
    // Configuration
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    title,
    description,
    className = '',
    // Controlled props
    currentPage: controlledPage,
    onPageChange: controlledOnPageChange,
    pageSize: controlledPageSize,
    onPageSizeChange: controlledOnPageSizeChange,
    searchQuery: controlledSearchQuery,
    onSearch: controlledOnSearch,
    searchable = false,
    searchPlaceholder = 'Search...',
    // Not used by TableContainer/Table; discard so they don't leak through
    // the ...props spread onto <Table> and then onto the native <table>.
    pagination,
    total,
    // Table specific props to pass down
    onRowClick,
    sortable = false,
    striped = true,
    bordered = false,
    compact = false,
    responsive = true,
    emptyMessage = 'No data available',
    ...props
}) => {
    // Internal state management (used if controlled props are not provided)
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
    const [internalSearchQuery, setInternalSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Determine which state to use
    const currentPage = controlledPage !== undefined ? controlledPage : internalPage;
    const pageSize = controlledPageSize !== undefined ? controlledPageSize : internalPageSize;
    const searchQuery = controlledSearchQuery !== undefined ? controlledSearchQuery : internalSearchQuery;

    // Notify parent of state changes
    const notifyChange = useCallback(() => {
        if (onDataChange) {
            onDataChange({
                page: currentPage,
                pageSize,
                searchQuery,
                filters,
                sortConfig
            });
        }
    }, [currentPage, pageSize, searchQuery, filters, sortConfig, onDataChange]);

    // Trigger notification when state changes
    useEffect(() => {
        // We only notify if onDataChange is provided and it's not the first render 
        // OR if we want to trigger initial fetch. 
        // For simplicity, we'll keep the current behavior but wrapped in useEffect.
        notifyChange();
    }, [notifyChange]);

    // Handlers
    const handlePageChange = (page) => {
        if (controlledOnPageChange) {
            controlledOnPageChange(page);
        } else {
            setInternalPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        if (controlledOnPageSizeChange) {
            controlledOnPageSizeChange(size);
        } else {
            setInternalPageSize(size);
            setInternalPage(1); // Reset to first page
        }
    };

    const handleSearch = (query) => {
        if (controlledOnSearch) {
            controlledOnSearch(query);
        } else {
            setInternalSearchQuery(query);
            setInternalPage(1); // Reset to first page
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        handlePageChange(1);
    };

    const handleSort = (config) => {
        setSortConfig(config);
        handlePageChange(1);
    };

    const handleReset = () => {
        handleSearch('');
        setFilters({});
        handlePageChange(1);
        setSortConfig({ key: null, direction: 'asc' });
    };

    // Prepare table state object for render props
    const tableState = {
        currentPage,
        pageSize,
        searchQuery,
        filters,
        sortConfig,
        totalItems,
        loading,
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
        handleFilterChange,
        handleSort,
        handleReset,
        pageSizeOptions
    };

    return (
        <div className={`table-container ${className}`}>
            {/* Header Section */}
            {(title || description || searchable || renderHeader) && (
                <div className="table-container__header">
                    <div className="table-container__header-top">
                        {(title || description) && (
                            <div className="table-container__titles">
                                {title && <h3 className="table-container__title">{title}</h3>}
                                {description && <p className="table-container__description">{description}</p>}
                            </div>
                        )}
                        <div className="table-toolbar">
                            {searchable && (
                                <SearchInput
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder={searchPlaceholder}
                                />
                            )}
                            {renderHeader && renderHeader(tableState)}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Table */}
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
                sortConfig={sortConfig}
                onSort={handleSort}
                {...props}
            />

            {/* Footer Section */}
            {renderFooter ? (
                renderFooter({
                    currentPage,
                    pageSize,
                    totalItems,
                    pageSizeOptions,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange
                })
            ) : (
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
};

export default TableContainer;
