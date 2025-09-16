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
    if (category) {
      dispatch(fetchProductsByCategory(category));
    }
  }, [category, dispatch]);

  // Filter out the current product
  const filteredProducts = categoryProducts.filter(
    (p) => p._id !== currentProductId
  );
  //handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product._id))
      .unwrap() // unwrap asyncThunk to catch errors
      .then(() => alert(`${product.name} added to cart!`))
      .catch((err) => alert(`Failed to add: ${err}`));
  };

  if (loadingCategory)
    return (
      <p className="mt-6 text-center text-gray-500">
        Loading similar products...
      </p>
    );
  if (errorCategory)
    return <p className="mt-6 text-center text-red-500">{errorCategory}</p>;
  if (!filteredProducts.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod._id}
            className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white flex flex-col"
          >
            <Link to={`/product/${prod._id}`} className="flex-1">
              <img
                src={import.meta.env.VITE_API_URL + prod.images[0]?.url}
                alt={prod.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{prod.name}</h3>
                <p className="text-red-600 font-semibold mt-1">
                  Rs. {prod.price}
                </p>
              </div>
            </Link>

            <button
              onClick={() => handleAddToCart(prod)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            >
              <FiShoppingCart className="text-lg" /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
