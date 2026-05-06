import { Field, useFormikContext } from "formik";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage";


const Input = ({
    label = "Enter Input here",
    name,
    type,
    placeholder,
    as = 'input',
    disabled = false,
    required = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { errors, touched } = useFormikContext();

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const hasError = errors[name] && touched[name];

    return (
        <div className="st-input-compo">
            <label className="st-label" htmlFor={name}>
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <div className="st-input-wrapper">
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
                        <span className={showPassword ? "st-icon--eye-blocked" : "st-icon--view"}></span>
                    </button>
                )}
            </div>
            <ErrorMessage name={name} />
        </div>
    )
}

export default Input;