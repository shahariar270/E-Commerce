import React from 'react';

const Pagination = ({
    currentPage,
    pageSize,
    totalItems,
    pageSizeOptions = [5, 10, 25, 50],
    onPageChange,
    onPageSizeChange,
}) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="table-pagination">
            <div className="table-pagination__info">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>
            <div className="table-pagination__controls">
                <div className="table-pagination__rows">
                    <span>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                    >
                        ««
                    </button>
                    <button
                        className="table-pagination__btn"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous Page"
                    >
                        «
                    </button>
                    <span className="table-pagination__page-info">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        className="table-pagination__btn"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        title="Next Page"
                    >
                        »
                    </button>
                    <button
                        className="table-pagination__btn"
                        onClick={() => onPageChange(totalPages || 1)}
                        disabled={currentPage >= totalPages}
                        title="Last Page"
                    >
                        »»
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
