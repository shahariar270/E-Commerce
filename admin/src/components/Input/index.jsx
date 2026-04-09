import { Field } from "formik";
import { useState } from "react";


const Input = ({
    label = "Enter Input here",
    name,
    type,
    placeholder,
    as = 'input',
    disabled = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type

    return (
        <div className="st-input-compo">
            <label className="st-label" htmlFor={name}>{label}</label>
            <div className="st-input-wrapper">
                <Field
                    as={as}
                    id={name}
                    name={name}
                    type={inputType}
                    className={as === 'input' ? 'st-input' : 'st-text-area'}
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
        </div>
    )
}

export default Input;