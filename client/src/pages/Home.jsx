import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../features/products/publicProductSlice";
import ProductCard from "../components/ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; 

import thumnail1 from "../assets/images/thumnail1.png";
import thumnail2 from "../assets/images/thumnail2.png";
import thumnail3 from "../assets/images/thumnail3.png";
import thumnail4 from "../assets/images/thumnail4.png";
import thumnail5 from "../assets/images/thumnail5.png";

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.publicProducts
  );

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  };

  const banners = [thumnail1, thumnail2, thumnail3, thumnail4, thumnail5];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <>{/* Banner Carousel */}
<div className="relative w-full mx-auto aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden rounded-xl shadow-md mb-8 ">
  {banners.map((src, index) => (
    <img
      key={index}
      src={src}
      alt={`Banner ${index + 1}`}
      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
        index === currentIndex ? "opacity-100" : "opacity-0"
      }`}
    />
  ))}

 {/* Left Arrow */}
<button
  onClick={() =>
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }
  className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 md:p-3 rounded-full shadow-lg transition"
>
  <FaArrowLeft size={16} md:size={20} />
</button>

{/* Right Arrow */}
<button
  onClick={() =>
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }
  className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 md:p-3 rounded-full shadow-lg transition"
>
  <FaArrowRight size={16} md:size={20} />
</button>


  {/* Navigation Dots */}
  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
    {banners.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
        className={`w-3 h-3 rounded-full transition-all ${
          index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>


{/* Products Section Container */}
<div className="max-w-[1600px] mx-auto px-6 py-12 bg-gray-50 rounded-lg shadow-md mt-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
    Top Products
  </h1>

  {loading && <p className="text-center text-gray-500">Loading...</p>}
  {error && <p className="text-center text-red-500">{error}</p>}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
  {products.map((product) => (
    <ProductCard
      key={product._id}
      product={product}
      onAddToCart={handleAddToCart}
    />
  ))}
</div>
</div>


    </>
  );
}
