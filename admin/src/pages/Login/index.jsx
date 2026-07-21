import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from "formik";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import { loginUser, clearError } from "../../store/slices/auth/authSlice";
import { loginSchema } from "../../Utils/validationSchemas";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import {jwtDecode} from 'jwt-decode';
import { getCookie } from '@utils/helper';
import logo from '../../assets/images/fulllogo.svg';
import SEO from '@Component/SEO';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(clearError());
    dispatch(loginUser({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        const token = getCookie('token');
        const user = jwtDecode(token);

          if (user.user_role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
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
      <SEO title="Sign In" description="Sign in to your E-Commerce account to track orders, manage your cart, and check out faster." noindex />
      <div className="st-login-card">
        <div className="st-login-header">
          <img
            src={logo}
            alt="logo"
            className="st-login-logo"
          />
          <h1 className="st-login-title">Welcome Back</h1>
          <p className="st-login-subtitle">
            Please enter your details to sign in
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
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

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />

              <div className="st-login-options">
                <label className="st-remember-me">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="st-forgot-password">
                  Forgot password?
                </a>
              </div>

              <Button
                label={isSubmitting || loading ? "Signing in..." : "Sign In"}
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
            Don't have an account?{" "}
            <a href="/register" className="st-signup-link">
              Sign up
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

export default Login;
