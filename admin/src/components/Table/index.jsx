import React from 'react';

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
    sortConfig = { key: null, direction: 'asc' },
    onSort,
    // Search/pagination props belong to TableContainer, not this component.
    // Destructure (and discard) them here so callers that pass them directly
    // to Table don't leak them onto the native <table> element below.
    searchable,
    searchPlaceholder,
    onSearch,
    searchQuery,
    pagination,
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    ...props
}) => {
    // Table classes
    const tableClasses = [
        'table',
        striped && 'table--striped',
        bordered && 'table--bordered',
        compact && 'table--compact',
        loading && 'table--loading',
        className
    ].filter(Boolean).join(' ');

    // Get sort class
    const getSortClass = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'asc' ? 'table__header-cell--sortable--asc' : 'table__header-cell--sortable--desc';
    };

    const handleSort = (key) => {
        if (!sortable || !onSort) return;
        
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        onSort({ key, direction });
    };

    const tableContent = (
        <div className="table-wrapper">
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
                        {data.length > 0 ? (
                            data.map((row, index) => (
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
        </div>
    );

    if (responsive) {
        return <div className="table--responsive-wrapper">{tableContent}</div>;
    }

    return tableContent;
};

export default Table;
