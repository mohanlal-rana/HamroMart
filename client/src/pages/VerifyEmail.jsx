// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resetAuthMessage } from "../features/auth/authSlice";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { tempUser, loading, error, successMessage } = useSelector(
    (state) => state.auth
  );

  const email = tempUser?.email || location.state?.email;

  useEffect(() => {
    if (!email) {
      alert("No email found. Please signup first.");
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp }));
  };

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(resetAuthMessage());
      navigate("/"); // redirect to home after OTP verification
    }
  }, [successMessage, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(resetAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify Your Email
        </h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-bold rounded-lg ${
              loading
                ? "bg-gray-400 text-black cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
