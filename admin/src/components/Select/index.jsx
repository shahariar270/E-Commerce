import ReactSelect from 'react-select';

const Select = ({
    options = [],
    name,
    onChange,
    value,
    label,
    onMenuScrollToBottom = () => { },
    onMenuScrollToTop = () => { },
    isMulti = false
}) => {

    return (
        <div className="st-select-container">
            <label className='st-label' htmlFor="type">{label}</label>
            <ReactSelect
                options={options}
                name={name}
                onChange={onChange}
                value={value}
                onMenuScrollToBottom={onMenuScrollToBottom}
                onMenuScrollToTop={onMenuScrollToTop}
                className='st-select'
                isMulti={isMulti}
                {...commonSelectProps}
            />
        </div>
    )
}

const commonSelectProps = {
    isClearable: true,
    isSearchable: true,
    noOptionsMessage: () => __('No options found', 'gemcrm'),
    classNamePrefix: 'gemcrm-select',
    className: 'gemcrm-select',
    menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
    menuPosition: 'fixed',
    styles: {
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base, state) => ({
            ...base,
            // Focused: primary color, Otherwise: border variable
            borderColor: state.isFocused ? 'var(--st-primary)' : 'var(--st-border)',
            // Box shadow using primary color on focus
            boxShadow: state.isFocused ? '0 0 0 1px var(--st-primary)' : 'none',
            borderRadius: '6px',
            minHeight: '36px',
            fontSize: '12px',
            backgroundColor: 'var(--st-background)',
            '&:hover': {
                borderColor: 'var(--st-primary)'
            },
        }),
        // Using secondary text styles for placeholder
        placeholder: (base) => ({
            ...base,
            color: 'var(--st-text-primary)',
            opacity: 0.7, // Adjusting for placeholder feel
            fontSize: '13px'
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--st-text-primary)',
            fontSize: '13px'
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '12px',
            backgroundColor: state.isSelected
                ? 'var(--st-primary)' // Selected background
                : state.isFocused
                    ? 'var(--st-secondary)' // Hover/Focus background
                    : 'transparent',
            color: state.isSelected
                ? 'var(--st-text-white)'
                : 'var(--st-text-primary)',
            '&:active': {
                backgroundColor: 'var(--st-primary-hover)',
            },
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: 'var(--st-text-primary)',
        }),
    },
};
export default Select;