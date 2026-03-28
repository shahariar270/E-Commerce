import ReactSelect from 'react-select';

const Select = ({
    options = [],
    name,
    onChange,
    value,
    label,
    onMenuScrollToBottom = () => { },
    onMenuScrollToTop = () => { },
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
            />
        </div>
    )
}

export default Select;