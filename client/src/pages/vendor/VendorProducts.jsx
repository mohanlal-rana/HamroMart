import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchVendorProducts,
  deleteVendorProduct,
  resetMessage,
} from "../../features/products/vendorProductSlice";

export default function VendorProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading, error, successMessage } = useSelector(
    (state) => state.vendorProducts
  );

  useEffect(() => {
    dispatch(fetchVendorProducts());
    return () => dispatch(resetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(resetMessage());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      alert("❌ " + error);
      dispatch(resetMessage());
    }
  }, [error, dispatch]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteVendorProduct(id));
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading products...</p>;
  if (!products.length) return <p className="text-center mt-10 text-lg">No products added yet.</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.map((product) => {
          // ✅ Correct way to get first image
          let imageUrl = null;
          if (product.images?.length > 0) {
            const img = product.images[0];
            if (img?.url) {
              imageUrl = `${import.meta.env.VITE_API_URL}${img.url}`;
            }
          }

          return (
            <div
              key={product._id}
              className="border rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col bg-white"
            >
              {/* Product Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Product Info */}
              <h2 className="text-xl font-semibold line-clamp-1">{product.name}</h2>
              <p className="text-gray-600 line-clamp-2 flex-1">{product.description}</p>

              <div className="mt-2 flex justify-between items-center">
                <p className="font-bold text-lg text-blue-600">Rs. {product.price}</p>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => navigate(`/vendor-home/products/edit/${product._id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
