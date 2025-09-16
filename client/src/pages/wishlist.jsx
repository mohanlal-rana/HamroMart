// src/pages/Wishlist.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist, fetchWishlist } from "../features/wishlistSlice";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa"; // react-icons

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id)); // Redux state updates instantly
  };

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">My Wishlist ❤️</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((product) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl shadow-md bg-white transition-all duration-300 ease-in-out"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    product.images?.[0]?.url
                      ? `${import.meta.env.VITE_API_URL}${
                          product.images[0].url
                        }`
                      : "https://via.placeholder.com/80"
                  }
                  alt={product.images?.[0]?.alt || product.name}
                  className="h-20 w-20 sm:h-16 sm:w-16 object-cover rounded-md"
                />
                <div className="max-w-xs">
                  <p className="font-medium text-base sm:text-lg">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">{product.colorFamily}</p>
                  <p className="text-blue-600 font-semibold">
                    Rs. {product.price}
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex gap-6 justify-end text-xl">
                <FaShoppingCart
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                  onClick={() => dispatch(addToCart(product))}
                />
                <FaTrashAlt
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => handleRemove(product._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
