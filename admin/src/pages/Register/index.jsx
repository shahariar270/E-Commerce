import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from "formik";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import { registerUser, clearError } from "../../store/slices/auth/authSlice";
import { registerSchema } from "../../Utils/validationSchemas";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const initialValues = {
    user_name: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(clearError());
    dispatch(registerUser(values))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="st-login-page">
      <div className="st-login-card">
        <div className="st-login-header">
          <img
            src="../../../assets/images/logo.svg"
            alt="logo"
            className="st-login-logo"
          />
          <h1 className="st-login-title">Create Account</h1>
          <p className="st-login-subtitle">
            Please enter your details to sign up
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
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
                label="User Name"
                name="user_name"
                type="text"
                placeholder="Enter your user name"
                required
              />

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

              <Input
                label="First Name"
                name="first_name"
                type="text"
                placeholder="Enter your first name"
                required
              />

              <Input
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Enter your last name"
                required
              />

              <Button
                label={isSubmitting || loading ? "Creating account..." : "Sign Up"}
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
            Already have an account?{" "}
            <a href="/login" className="st-signup-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
