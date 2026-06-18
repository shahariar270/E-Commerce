import React from 'react';

const SearchInput = ({
    value,
    onChange,
    placeholder = 'Search...',
    onClear,
    className = ''
}) => {
    return (
        <div className={`table-search ${className}`}>
            <input
                type="text"
                className="table-search__input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button 
                    className="table-search__clear"
                    onClick={() => {
                        onChange('');
                        onClear?.();
                    }}
                    type="button"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

export default SearchInput;
