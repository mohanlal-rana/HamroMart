import React from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { addToWishlist } from "../features/wishlistSlice";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    dispatch(addToWishlist(product));
    alert(`${product.name} added to wishlist!`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  const handleNavigate = () => navigate(`/product/${product._id}`);

  return (
    <div
      onClick={handleNavigate}
      className="bg-white shadow-lg rounded-xl w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] flex flex-col overflow-hidden relative cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container with aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden">
        {product.images?.[0] && (
          <img
            src={import.meta.env.VITE_API_URL + product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {/* Wishlist Button - Always visible, but can be styled on hover */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 opacity-90 hover:opacity-100"
        >
          <FiHeart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <div className="flex items-center justify-between mt-2 mb-3">
          <p className="text-red-600 font-bold text-base sm:text-lg">
            Rs. {product.price}
          </p>
          {product.discount && (
            <span className="bg-yellow-300 text-xs font-semibold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 text-sm md:text-base py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
        >
          <FiShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}