import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from "formik";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import { forgotPassword, clearError, clearMessage } from "../../store/slices/auth/authSlice";
import { forgotPasswordSchema } from "../../Utils/validationSchemas";
import "../Login/style.scss";
import logo from '../../assets/images/logo.svg';
import SEO from '@Component/SEO';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const initialValues = { email: "" };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(clearMessage());
    dispatch(forgotPassword(values))
      .unwrap()
      .catch(() => {
        // Error is handled by Redux
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="st-login-page eshop-theme">
      <SEO title="Forgot Password" description="Reset your E-Commerce account password." noindex />
      <div className="st-login-card">
        <div className="st-login-header">
          <div className="st-login-logo">
            <img src={logo} alt="" className="st-login-logo__icon" />
            <span className="st-login-logo__text">E-commerce</span>
          </div>
          <h1 className="st-login-title">Forgot Password</h1>
          <p className="st-login-subtitle">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="st-login-form">
              {error && (
                <div className="st-login-error" style={{
                  color: '#dc3545',
                  marginBottom: '16px',
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '4px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}

              {message && !error && (
                <div className="st-login-success" style={{
                  color: '#155724',
                  marginBottom: '16px',
                  padding: '10px',
                  backgroundColor: '#d4edda',
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb'
                }}>
                  {message}
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <Button
                label={isSubmitting || loading ? "Sending..." : "Send Reset Link"}
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || loading}
                style={{ width: "100%", marginTop: "8px" }}
              />
            </Form>
          )}
        </Formik>

        <div className="st-login-footer">
          <p>
            Remembered your password?{" "}
            <a href="/login" className="st-signup-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <p className="st-login-back">
        <a href="/">← Back to store</a>
      </p>
    </div>
  );
};

export default ForgotPassword;
