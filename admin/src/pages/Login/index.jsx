import { Formik, Form } from "formik";
import Input from "../../components/Input";
import Button from "../../components/Buttons";
import "./style.scss";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Login values:", values);
    // Add your login API call here
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
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
          <h1 className="st-login-title">Welcome Back</h1>
          <p className="st-login-subtitle">
            Please enter your details to sign in
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="st-login-form">
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
                label={isSubmitting ? "Signing in..." : "Sign In"}
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                style={{ width: "100%", marginTop: "8px" }}
              />
            </Form>
          )}
        </Formik>

        <div className="st-login-footer">
          <p>
            Don't have an account?{" "}
            <a href="#" className="st-signup-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;