import { useFormikContext } from "formik";

const ErrorMessage = ({ name }) => {
    const { errors } = useFormikContext();
    const errorMessage = errors[name];

    if (!errorMessage) return null;

    return (
        <span className="st-error">
            {errorMessage}
        </span>
    );
};

export default ErrorMessage;