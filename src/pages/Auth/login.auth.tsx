import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState, useAppDispatch } from "../../redux/store";
import { loginUser } from "../../redux/slices/auth.slice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  //   const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Effect to handle post-login actions
  useEffect(() => {
    if (user) {
      //   alert("Login successful!");
      toast.success("Login successful!");
      //   navigate("/dashboard");
    }
  }, [user, dispatch]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={formik.handleSubmit} className="login-form">
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.username && formik.errors.username
                ? "input-error"
                : ""
            }
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.password && formik.errors.password
                ? "input-error"
                : ""
            }
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        {/* General Error Message */}
        {error && <div className="error-message general-error">{error}</div>}

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
