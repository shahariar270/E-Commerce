import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import { resetPassword, clearError, clearMessage } from "../../store/slices/auth/authSlice";
import { resetPasswordSchema } from "../../Utils/validationSchemas";
import "../Login/style.scss";
import logo from '../../assets/images/logo.svg';
import SEO from '@Component/SEO';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, message } = useSelector((state) => state.auth);

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const linkIsValid = Boolean(token && email);

  const initialValues = {
    new_password: "",
    confirm_password: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(clearMessage());
    dispatch(resetPassword({ email, token, new_password: values.new_password }))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        // Error is handled by Redux
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="st-login-page eshop-theme">
      <SEO title="Reset Password" description="Choose a new password for your E-Commerce account." noindex />
      <div className="st-login-card">
        <div className="st-login-header">
          <div className="st-login-logo">
            <img src={logo} alt="" className="st-login-logo__icon" />
            <span className="st-login-logo__text">E-commerce</span>
          </div>
          <h1 className="st-login-title">Reset Password</h1>
          <p className="st-login-subtitle">
            Choose a new password for your account
          </p>
        </div>

        {!linkIsValid ? (
          <div className="st-login-error" style={{
            color: '#dc3545',
            marginBottom: '16px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            This reset link is invalid. Please request a new one from the{" "}
            <a href="/forgot-password">forgot password</a> page.
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={resetPasswordSchema}
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
                  label="New Password"
                  name="new_password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  placeholder="Re-enter your new password"
                  required
                />

                <Button
                  label={isSubmitting || loading ? "Resetting..." : "Reset Password"}
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || loading}
                  style={{ width: "100%", marginTop: "8px" }}
                />
              </Form>
            )}
          </Formik>
        )}

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

export default ResetPassword;
