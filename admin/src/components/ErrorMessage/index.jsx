import { useFormikContext, getIn } from "formik";

const ErrorMessage = ({ name }) => {
    const { errors } = useFormikContext();
    // errors is a nested object for dotted field paths (e.g.
    // "shippingAddress.name" -> errors.shippingAddress.name), so a plain
    // errors[name] lookup always misses for anything but a top-level field.
    const errorMessage = getIn(errors, name);

    if (!errorMessage) return null;

    return (
        <span className="st-error">
            {errorMessage}
        </span>
    );
};

export default ErrorMessage;