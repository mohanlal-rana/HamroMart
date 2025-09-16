import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { addToWishlist } from "../features/wishlistSlice";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // prevent navigation
    dispatch(addToWishlist(product._id));
    alert(`${product.name} added to wishlist!`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent navigation
    dispatch(addToCart(product._id));
    alert(`${product.name} added to cart!`);
  };

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-white shadow-lg rounded-2xl w-64 h-[420px] flex flex-col overflow-hidden relative cursor-pointer hover:shadow-xl transition"
    >
      {/* Image */}
      {product.images && product.images.length > 0 && (
        <img
          src={import.meta.env.VITE_API_URL + product.images[0].url}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      )}

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>

        <div className="flex items-center mb-4">
          <p className="text-red-600 font-bold text-lg mr-2">Rs. {product.price}</p>
          {product.discount && (
            <span className="bg-yellow-300 text-xs font-semibold px-2 py-1 rounded-full relative -top-1">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-auto">
          {/* Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className="px-3 py-2 rounded-lg text-sm font-medium shadow bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Add to Wishlist
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
