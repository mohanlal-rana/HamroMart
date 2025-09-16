import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { becomeVendor, resetAuthMessage } from "../features/auth/authSlice";

export default function VendorForm() {
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    gstNumber: "",
  });

  const [fieldErrors, setFieldErrors] = useState({}); // New state for field-level errors

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading, error, successMessage } = useSelector(
    (state) => state.auth
  );

  const [ready, setReady] = useState(false);

  // Access control
  useEffect(() => {
    if (user === null || token === null) return;
    if (!user || !token) {
      navigate("/login");
      return;
    }
    if (user.role === "vendor" || user.role === "admin") {
      navigate("/");
      return;
    }
    setReady(true);
  }, [user, token, navigate]);

  // Handle success message
  useEffect(() => {
    if (successMessage) {
      dispatch(resetAuthMessage());
      navigate("/");
    }
  }, [successMessage, dispatch, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      // If error contains structured Zod errors
      if (error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.field] = e.message;
        });
        setFieldErrors(newErrors);
      } else {
        // Generic error
        alert("❌ " + (error.message || error));
      }
      dispatch(resetAuthMessage());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(becomeVendor(formData));
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Shop Name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {fieldErrors.shopName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.shopName}</p>
            )}
          </div>

          <div>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              placeholder="Shop Description"
              rows={4}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {fieldErrors.shopDescription && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.shopDescription}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {fieldErrors.gstNumber && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.gstNumber}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-bold rounded-lg ${
              loading
                ? "bg-gray-400 text-black cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
