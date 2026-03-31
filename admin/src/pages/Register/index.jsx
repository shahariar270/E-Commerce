import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import { registerUser, clearError } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
// import "./style.scss";

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

  const validationSchema = Yup.object({
    user_name: Yup.string()
      .min(2, "User name must be at least 2 characters")
      .required("User name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    first_name: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),
    last_name: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
  });

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
          validationSchema={validationSchema}
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
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />

              <Input
                label="First Name"
                name="first_name"
                type="text"
                placeholder="Enter your first name"
              />

              <Input
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Enter your last name"
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
