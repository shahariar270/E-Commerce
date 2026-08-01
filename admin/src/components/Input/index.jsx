import { Field, useFormikContext, getIn } from "formik";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage";

// Inline rather than icon-font glyphs: the font only ships a single "look"
// icon with no hidden-state counterpart, which left the hide/show toggle
// rendering as an empty box for both states.
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);


const Input = ({
    label = "Enter Input here",
    name,
    type,
    placeholder,
    as = 'input',
    disabled = false,
    required = false,
    rightElement = null,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { errors, touched } = useFormikContext();

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    // Nested field names (e.g. "shippingAddress.name") need a nested lookup —
    // errors/touched are shaped as { shippingAddress: { name: ... } }, not
    // flat-keyed by the dotted string.
    const hasError = getIn(errors, name) && getIn(touched, name);

    return (
        <div className="st-input-compo">
            <label className="st-label" htmlFor={name}>
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <div className={`st-input-wrapper ${rightElement ? 'st-input-wrapper--merged' : ''} ${isPassword ? 'st-input-wrapper--password' : ''}`}>
                <Field
                    as={as}
                    id={name}
                    name={name}
                    type={inputType}
                    className={`${as === 'input' ? 'st-input' : 'st-text-area'} ${hasError ? 'st-input--error' : ''}`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="st-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
                {rightElement && (
                    <div className="st-input-right-element">
                        {rightElement}
                    </div>
                )}
            </div>
            <ErrorMessage name={name} />
        </div>
    )
}

export default Input;