import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addShippingAddress, fetchShippingAddress, updateShippingAddress } from "../features/shippingSlice";
import { useNavigate } from "react-router-dom";

export default function ShippingAddressForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address, loading, error } = useSelector((state) => state.shipping);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nepal",
    landmark: "",
  });

  // Fetch current address
  useEffect(() => {
    dispatch(fetchShippingAddress());
  }, [dispatch]);

  // Prefill form if editing
  useEffect(() => {
    if (address) setFormData({ ...formData, ...address });
  }, [address]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address) {
      dispatch(updateShippingAddress(formData)).then(() => dispatch(fetchShippingAddress()));
    } else {
      dispatch(addShippingAddress(formData)).then(() => dispatch(fetchShippingAddress()));
    }
    navigate(-1); // go back to checkout
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{address ? "Update Shipping Address" : "Add Shipping Address"}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName","phone","addressLine1","addressLine2","city","state","postalCode","landmark"].map((field) => (
          <div key={field}>
            <label className="block font-medium">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={["fullName","phone","addressLine1","city","postalCode"].includes(field)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          {address ? "Update Address" : "Add Address"}
        </button>
      </form>
    </div>
  );
}
