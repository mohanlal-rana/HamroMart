import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthMessage } from "../features/auth/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({}); // field-level errors

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Handle success
  useEffect(() => {
    if (successMessage) {
      dispatch(resetAuthMessage());
      navigate("/");
    }
  }, [successMessage, dispatch, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.field || e.path?.[0]] = e.message;
        });
        setFieldErrors(newErrors);
      } else {
        alert(error.message || "Login failed"); // fallback
      }
      dispatch(resetAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login to HamroMart
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-4 border-t border-gray-300"></div>

        <p className="text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
