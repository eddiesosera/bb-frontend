import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState, useAppDispatch } from "../../redux/store";
import { registerUser, resetAuthState } from "../../redux/slices/auth.slice";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  //   const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (user) {
      toast.success("Registration successful!");
      //   navigate("/dashboard");
      dispatch(resetAuthState());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      const { username, email, password } = values;
      dispatch(registerUser({ username, email, password }));
    },
  });

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={formik.handleSubmit} className="register-form">
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

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.email && formik.errors.email ? "input-error" : ""
            }
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "input-error"
                : ""
            }
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
