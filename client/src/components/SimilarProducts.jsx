import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "../features/products/publicProductSlice";
import { addToCart } from "../features/cartSlice";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function SimilarProducts({ category, currentProductId }) {
  const dispatch = useDispatch();
  const { categoryProducts, loadingCategory, errorCategory } = useSelector(
    (state) => state.publicProducts
  );

  useEffect(() => {
    if (category) dispatch(fetchProductsByCategory(category));
  }, [category, dispatch]);

  const filteredProducts = categoryProducts.filter(
    (p) => p._id !== currentProductId
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => alert(`${product.name} added to cart!`))
      .catch((err) => alert(`Failed to add: ${err}`));
  };

  if (loadingCategory)
    return <p className="mt-6 text-center text-gray-500">Loading similar products...</p>;
  if (errorCategory)
    return <p className="mt-6 text-center text-red-500">{errorCategory}</p>;
  if (!filteredProducts.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod._id}
            className="flex-shrink-0 w-1/2 sm:w-1/2 md:w-auto border rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white flex flex-col"
          >
            <Link to={`/product/${prod._id}`} className="flex-1">
              <img
                src={import.meta.env.VITE_API_URL + prod.images[0]?.url}
                alt={prod.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                  {prod.name}
                </h3>
                <p className="text-red-600 font-semibold mt-1 text-sm sm:text-base">
                  Rs. {prod.price}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleAddToCart(prod)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm"
            >
              <FiShoppingCart className="text-lg" /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
