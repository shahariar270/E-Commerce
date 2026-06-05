import React, { useState, useMemo } from 'react';

const Table = ({
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
    className = '',
    // Pagination props
    pagination = true,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    total, // Total number of items for server-side pagination
    // Filter props
    showFilters = false,
    filterableColumns = [],
    // Search props
    searchable = false,
    searchPlaceholder = 'Search...',
    onSearch,
    // External state
    currentPage: externalPage,
    pageSize: externalPageSize,
    searchQuery: externalSearch,
    filters: externalFilters,
    onPageChange,
    onPageSizeChange,
    ...props
}) => {
    // Internal state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
    const [internalSearch, setInternalSearch] = useState('');
    const [internalFilters, setInternalFilters] = useState({});

    // Use external state if provided, otherwise use internal state
    const currentPage = externalPage ?? internalPage;
    const pageSize = externalPageSize ?? internalPageSize;
    const searchQuery = externalSearch ?? internalSearch;
    const filters = externalFilters ?? internalFilters;

    const isServerSide = total !== undefined;

    // Handle page change
    const handlePageChange = (newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        } else {
            setInternalPage(newPage);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize) => {
        const newSize = parseInt(newPageSize, 10);
        if (onPageSizeChange) {
            onPageSizeChange(newSize);
        } else {
            setInternalPageSize(newSize);
            setInternalPage(1); // Reset to first page
        }
    };

    // Handle search
    const handleSearch = (value) => {
        if (onSearch) {
            onSearch(value);
        } else {
            setInternalSearch(value);
            setInternalPage(1); // Reset to first page on search
        }
    };

    // Handle sort
    const handleSort = (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort class
    const getSortClass = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'asc' ? 'table__header-cell--sortable--asc' : 'table__header-cell--sortable--desc';
    };

    // Process data with sorting, filtering, and search
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search locally only if NOT server-side
        if (searchable && searchQuery && !onSearch) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(row => {
                return columns.some(col => {
                    const value = row[col.key];
                    if (value == null) return false;
                    return String(value).toLowerCase().includes(searchLower);
                });
            });
        }

        // Apply column filters
        if (showFilters) {
            Object.entries(filters).forEach(([key, filterValue]) => {
                if (filterValue && filterValue.trim() !== '') {
                    const filterLower = filterValue.toLowerCase();
                    result = result.filter(row => {
                        const value = row[key];
                        if (value == null) return false;
                        return String(value).toLowerCase().includes(filterLower);
                    });
                }
            });
        }

        // Apply sorting locally
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, filters, sortConfig, columns, searchable, showFilters, onSearch]);

    // Get paginated data
    const paginatedData = useMemo(() => {
        if (!pagination || isServerSide) return processedData;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return processedData.slice(startIndex, endIndex);
    }, [processedData, currentPage, pageSize, pagination, isServerSide]);

    // Calculate total pages
    const totalPages = Math.ceil((total ?? processedData.length) / pageSize);

    // Table classes
    const tableClasses = [
        'table',
        striped && 'table--striped',
        bordered && 'table--bordered',
        compact && 'table--compact',
        loading && 'table--loading',
        className
    ].filter(Boolean).join(' ');

    // Render pagination
    const renderPagination = () => {
        if (!pagination) return null;

        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, total ?? processedData.length);

        return (
            <div className="table-pagination">
                <div className="table-pagination__info">
                    Showing {startItem} to {endItem} of {total ?? processedData.length} entries
                </div>
                <div className="table-pagination__controls">
                    <div className="table-pagination__rows">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                            className="table-pagination__select"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="table-pagination__buttons">
                        <button
                            className="table-pagination__btn"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            ««
                        </button>
                        <button
                            className="table-pagination__btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        <span className="table-pagination__page-info">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            className="table-pagination__btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            »
                        </button>
                        <button
                            className="table-pagination__btn"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage >= totalPages}
                        >
                            »»
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render search bar
    const renderSearch = () => {
        if (!searchable) return null;

        return (
            <div className="table-search">
                <input
                    type="text"
                    className="table-search__input"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="table-search__clear"
                        onClick={() => handleSearch('')}
                    >
                        ×
                    </button>
                )}
            </div>
        );
    };

    // Render filter row
    

    // Render table content
    const tableContent = (
        <div className="table-wrapper">
            {(searchable || showFilters) && (
                <div className="table-toolbar">
                    {renderSearch()}
                </div>
            )}
            <div className={responsive ? 'table--responsive' : ''}>
                <table className={tableClasses} {...props}>
                    <thead className="table__header">
                        <tr className="table__header-row">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`table__header-cell ${sortable ? `table__header-cell--sortable ${getSortClass(column.key)}` : ''}`}
                                    onClick={() => handleSort(column.key)}
                                    style={{ width: column.width, textAlign: column.align || 'left' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table__body">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`table__body-row ${onRowClick ? 'table__body-row--clickable' : ''}`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="table__body-cell"
                                            style={{ textAlign: column.align || 'left' }}
                                        >
                                            {column?.render ? column?.render(row[column.key], row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="table__empty">
                                    <div className="table__empty-icon">📊</div>
                                    <p className="table__empty-message">{emptyMessage}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {renderPagination()}
        </div>
    );

    if (responsive) {
        return <div className="table--responsive-wrapper">{tableContent}</div>;
    }

    return tableContent;
};

export default Table;
