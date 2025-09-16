import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleProduct,
  updateVendorProduct,
  resetMessage,
  clearSingleProduct,
} from "../../features/products/vendorProductSlice";

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleProduct, loading, error, successMessage } = useSelector(
    (state) => state.vendorProducts
  );

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    category: "",
    features: [],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const categories = [
    "electronics",
    "fashion",
    "books",
    "home-appliances",
    "sports",
  ];

  // Fetch product on mount
  useEffect(() => {
    dispatch(fetchSingleProduct(id));
    return () => {
      dispatch(clearSingleProduct());
      dispatch(resetMessage());
    };
  }, [dispatch, id]);

  // Populate form when product is fetched
  useEffect(() => {
    if (singleProduct) {
      setProduct({
        name: singleProduct.name || "",
        description: singleProduct.description || "",
        price: Number(singleProduct.price) || 0,
        discount: Number(singleProduct.discount) || 0,
        stock: Number(singleProduct.stock) || 0,
        category: singleProduct.category || "",
        features: Array.isArray(singleProduct.features)
          ? singleProduct.features
          : [],
        _id: singleProduct._id,
      });

      setImages(
        (singleProduct.images || []).map((img) =>
          typeof img === "string" ? img : img?.url || ""
        )
      );
    }
  }, [singleProduct]);

  // Handle input changes
  const handleChange = (field, value) => {
    if (["price", "discount", "stock"].includes(field)) {
      // Convert string to number
      const numberValue = value === "" ? 0 : Number(value);
      setProduct((prev) => ({ ...prev, [field]: numberValue }));
    } else {
      setProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Features
  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    setProduct((prev) => ({
      ...prev,
      features: Array.isArray(prev.features)
        ? [...prev.features, trimmed]
        : [trimmed],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Images
  const handleImageChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    const img = images[index];
    if (typeof img === "string") {
      setDeletedImages((prev) => [...prev, img]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
// In EditProduct.jsx

// Submit
const handleSubmit = (e) => {
  e.preventDefault();
  setFieldErrors({});

  const formData = new FormData();
  
  // Append non-array fields
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", Number(product.price));
  formData.append("discount", Number(product.discount || 0));
  formData.append("stock", Number(product.stock));
  formData.append("category", product.category);

  // Append features as repeated fields
  product.features.forEach(f => formData.append("features[]", f));

  // Append deletedImages as repeated fields
  deletedImages.forEach(url => formData.append("deletedImages[]", url));

  // Append new image files
  images.forEach((img) => {
    if (img instanceof File) formData.append("images", img);
  });

  dispatch(updateVendorProduct({ id: product._id, formData }));
};

  // Success handling
  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      navigate("/vendor-home/products");
      dispatch(resetMessage());
    }
  }, [successMessage, navigate, dispatch]);

  // Error handling
  useEffect(() => {
    if (!error) return;

    if (error.errors && Array.isArray(error.errors)) {
      const newErrors = {};
      error.errors.forEach((e) => {
        newErrors[e.field] = e.message;
      });
      setFieldErrors(newErrors);
    } else if (error.message) {
      alert("❌ " + error.message);
    }
    dispatch(resetMessage());
  }, [error, dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={product.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Product Name"
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
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Description"
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
            value={product.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Price"
            required
          />
          {fieldErrors.price && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
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
            value={product.discount || 0}
            onChange={(e) => handleChange("discount", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Discount %"
          />
          {fieldErrors.discount && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.discount}</p>
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
            value={product.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Stock"
            required
          />
          {fieldErrors.stock && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.stock}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={product.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.category}</p>
          )}
        </div>

        {/* Features */}
        <div>
          <label className="block font-medium mb-1">Features</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add feature"
              className="flex-1 border p-2 rounded"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside mb-4">
            {product.features.map((f, i) => (
              <li key={i} className="flex justify-between items-center">
                {f}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-red-500 font-bold ml-2"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.filter(Boolean).map((img, i) => {
              let src;
              if (img instanceof File) {
                src = URL.createObjectURL(img);
              } else if (typeof img === "string") {
                src = img.startsWith("http")
                  ? img
                  : `${import.meta.env.VITE_API_URL}${
                      img.startsWith("/") ? img : `/${img}`
                    }`;
              } else {
                return null;
              }
              return (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
