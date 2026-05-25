import React from 'react';
import './styles.scss';

const Pagination = ({
    currentPage,
    total,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 25, 50],
    showPageSizeOptions = true
}) => {
    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 0) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
        <div className="st-pagination">
            <div className="st-pagination__info">
                Showing {startItem} to {endItem} of {total} entries
            </div>
            <div className="st-pagination__controls">
                {showPageSizeOptions && (
                    <div className="st-pagination__rows">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                            className="st-pagination__select"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="st-pagination__buttons">
                    <button
                        className="st-pagination__btn"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        ««
                    </button>
                    <button
                        className="st-pagination__btn"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <span className="st-pagination__page-info">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        className="st-pagination__btn"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        »
                    </button>
                    <button
                        className="st-pagination__btn"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                    >
                        »»
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
