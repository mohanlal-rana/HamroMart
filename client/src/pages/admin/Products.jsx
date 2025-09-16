import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProductsAdmin,
  deleteAdminProduct,
  confirmAdminProduct,
  resetAdminProductsState,
} from "../../features/products/adminProductSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [filter, setFilter] = useState("all"); // "all", "confirmed", "notConfirmed"

  useEffect(() => {
    dispatch(fetchAllProductsAdmin());
    return () => {
      dispatch(resetAdminProductsState());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteAdminProduct(id));
    }
  };

  const handleConfirm = (id) => {
    dispatch(confirmAdminProduct(id));
  };

  // Filter products based on confirmed status
  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return product.confirmed;
    if (filter === "notConfirmed") return !product.confirmed;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-3 py-1 rounded ${
            filter === "confirmed"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter("notConfirmed")}
          className={`px-3 py-1 rounded ${
            filter === "notConfirmed"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Not Confirmed
        </button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {filteredProducts.length === 0 && !loading ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Vendor</th>
                <th className="py-2 px-4 text-left">Confirmed</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4 flex items-center gap-2">
                    {product.images[0] && (
                      <img
                        src={
                          import.meta.env.VITE_API_URL + product.images[0].url
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>{product.name}</span>
                  </td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{product.stock}</td>
                  <td className="py-2 px-4">{product.vendor?.name || "N/A"}</td>
                  <td className="py-2 px-4">
                    {product.confirmed ? (
                      <span className="text-green-600 font-semibold">✔</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✖</span>
                    )}
                  </td>

                  <td className="py-2 px-4 flex gap-2">
                    {!product.confirmed && (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleConfirm(product._id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
