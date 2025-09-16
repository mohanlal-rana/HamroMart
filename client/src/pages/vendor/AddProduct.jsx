import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVendorProduct,
  resetMessage,
} from "../../features/products/vendorProductSlice";

export default function AddProduct() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.vendorProducts
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    discount: "",
    images: [],
    features: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // field-level errors

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  // Handle multiple image selection
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...Array.from(e.target.files)],
    }));
  };

  // Add feature
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, featureInput],
    }));
    setFeatureInput("");
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

 
// Submit form
const handleSubmit = (e) => {
  e.preventDefault();
  setFieldErrors({});

  const data = new FormData();

  // Append normal fields
  Object.keys(formData).forEach((key) => {
    if (!["images", "features"].includes(key)) {
      data.append(key, formData[key] || "");
    }
  });

  // Append images as array properly
  if (formData.images && formData.images.length > 0) {
    formData.images.forEach((img) => data.append("images", img)); // Note the key is "images", not "images[]"
  }

  // Append features as repeated fields
  if (formData.features && formData.features.length > 0) {
    formData.features.forEach((f) => data.append("features[]", f)); // This is correct
  }

  dispatch(createVendorProduct(data));
};


  // Reset messages on unmount
  useEffect(() => () => dispatch(resetMessage()), [dispatch]);

  // Handle success
  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        discount: "",
        images: [],
        features: [],
      });
      setFeatureInput("");
      setFieldErrors({});
    }
  }, [successMessage]);

  // Handle errors from backend
  useEffect(() => {
    if (!error) return;

    if (error.errors && Array.isArray(error.errors)) {
      const newErrors = {};
      error.errors.forEach((e) => {
        newErrors[e.field] = e.message; // map backend errors to fields
      });
      setFieldErrors(newErrors);
    } else if (error.message) {
      alert(error.message); // fallback for non-field errors
    }
  }, [error]);

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border rounded px-4 py-2"
            required
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded px-4 py-2"
            rows={3}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block font-medium mb-1">
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border rounded px-4 py-2"
            required
          />
          {fieldErrors.price && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block font-medium mb-1">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border rounded px-4 py-2"
            required
          />
          {fieldErrors.stock && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.stock}</p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block font-medium mb-1">
            Discount %
          </label>
          <input
            id="discount"
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="w-full border rounded px-4 py-2"
          />
          {fieldErrors.discount && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.discount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select Category --</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="home-appliances">Home Appliances</option>
            <option value="sports">Sports</option>
          </select>
          {fieldErrors.category && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.category}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block mb-1 font-medium">
            Product Images
          </label>
          <input
            id="images"
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
          {fieldErrors.images && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.images}</p>
          )}
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt={`preview-${i}`}
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block font-medium mb-2">
            Features (Bullet Points)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add feature"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-600 text-white px-3 py-1 rounded"
              disabled={!featureInput.trim()}
            >
              Add
            </button>
          </div>
          {fieldErrors.features && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.features}</p>
          )}
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {formData.features.map((f, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {f}{" "}
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="text-red-500 font-bold ml-2"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
