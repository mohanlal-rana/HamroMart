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
    e.stopPropagation();
    dispatch(addToWishlist(product._id));
    alert(`${product.name} added to wishlist!`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product._id));
    alert(`${product.name} added to cart!`);
  };

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
  };

  return (
<div
  onClick={handleNavigate}
  className="bg-white shadow-lg rounded-xl w-full max-w-[150px] sm:w-48 md:w-64 flex flex-col overflow-hidden relative cursor-pointer hover:shadow-xl transition"
>
      {/* Image */}
      {product.images && product.images.length > 0 && (
        <img
          src={import.meta.env.VITE_API_URL + product.images[0].url}
          alt={product.name}
          className="w-full object-cover aspect-[4/3] sm:aspect-[4/3] md:aspect-[16/12]"
        />
      )}

      {/* Info */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h2>

        <div className="flex items-center mb-2 sm:mb-3">
          <p className="text-red-600 font-bold text-sm sm:text-base md:text-lg mr-2">
            Rs. {product.price}
          </p>
          {product.discount && (
            <span className="bg-yellow-300 text-[10px] sm:text-xs md:text-xs font-semibold px-2 py-1 rounded-full relative -top-1">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-auto">
          <button
            onClick={handleAddToWishlist}
            className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium shadow bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Wishlist
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 shadow-lg"
          >
            <FiShoppingCart size={16} sm:size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
