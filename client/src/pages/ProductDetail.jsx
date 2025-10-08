import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { addToWishlist } from "../features/wishlistSlice";
import { fetchShippingAddress } from "../features/shippingSlice";
import { fetchProductById } from "../features/products/publicProductSlice";
import SimilarProducts from "../components/SimilarProducts";
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loadingProduct, errorProduct } = useSelector(
    (state) => state.publicProducts
  );
  const shippingAddress = useSelector(
    (state) => state.shipping.address
  );
  const user = useSelector((state) => state.auth.user);

  const shippingLoading = useSelector((state) => state.shipping.loading);
  
  const [mainImage, setMainImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const getDeliveryDate = (minDays = 3, maxDays = 5) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { day: "numeric", month: "short" };
    return `${minDate.toLocaleDateString(
      "en-US",
      options
    )} - ${maxDate.toLocaleDateString("en-US", options)}`;
  };

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.images?.length > 0) setMainImage(product.images[0].url);
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity }));
    alert("Product added to cart!");
  };

  useEffect(() => {
    dispatch(fetchShippingAddress());
  }, [user, dispatch]);

  const handleBuyNow = () => {
    if (!shippingAddress) {
      alert("Please add a shipping address first!");
      navigate("/shipping-address-form");
      return;
    }
    navigate("/checkout", { state: { product, quantity } });
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product._id));
    alert("Product added to wishlist!");
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loadingProduct) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (errorProduct) return <div className="p-10 text-center text-red-500">{errorProduct}</div>;
  if (!product) return <div className="p-10 text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <p className="mb-4 text-green-600 text-sm">
        Home &gt; {product.category} &gt; {product.name}
      </p>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Images */}
        <div className="md:w-1/2">
          <div className="w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={import.meta.env.VITE_API_URL + (hoverImage || mainImage)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={import.meta.env.VITE_API_URL + img.url}
                alt={`thumb-${i}`}
                className={`h-16 w-16 object-cover rounded-lg border cursor-pointer hover:border-blue-500 transition ${
                  mainImage === img.url
                    ? "border-blue-500 border-2"
                    : "border-gray-300"
                }`}
                onMouseEnter={() => setHoverImage(img.url)}
                onMouseLeave={() => setHoverImage("")}
                onClick={() => setMainImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm">
            ⭐ {product.rating || 0} | {product.questionsAnswered || 0} Answered Questions
          </p>

          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-red-600">
              Rs. {product.price}
            </p>
            {product.discount && (
              <span className="bg-yellow-300 text-sm font-semibold px-3 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <p
            className={`font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          {/* Quantity + Wishlist */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center border-x px-2 py-1"
                />
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToWishlist}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              <FiHeart /> Wishlist
            </button>
          </div>

          {/* Delivery Options */}
   <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <FiTruck className="text-blue-600" /> Delivery Options
            </h3>
            
{user &&(            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-red-500" />
                {shippingLoading ? (
                  <p className="font-medium">Loading address...</p>
                ) : shippingAddress ? (
                  <p className="font-medium">
                    {shippingAddress.state}, {shippingAddress.city}
                  </p>
                ) : (
                  <p className="font-medium text-red-500">
                    No shipping address added
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/shipping-address-form")}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                {shippingAddress ? "Change" : "Add"}
              </button>
            </div>)}

            <div className="flex items-center gap-2">
              <FiTruck className="text-green-600" />
              <p className="font-medium text-sm">
                Standard Delivery - Guaranteed by {getDeliveryDate(3, 5)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-yellow-500" />
              <p className="font-medium text-sm">Delivery Fee: Rs. 140</p>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-blue-500" />
              <p className="font-medium text-sm">Cash on Delivery Available</p>
            </div>
          </div>

          {/* Product Features */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Product Features</h2>
            {product.features?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                {product.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No additional features provided.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Fixed Action Buttons (Visible on Mobile) */}
      <div className="sticky bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 py-3 px-4 shadow-lg flex justify-between gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FiShoppingCart /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Buy Now
        </button>
      </div>

      {/* Buttons (Hidden on Mobile) */}
      <div className="hidden md:flex justify-start gap-4 mt-8">
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FiShoppingCart /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Buy Now
        </button>
      </div>

      {/* Similar Products */}
      {product?.category && (
        <SimilarProducts
          category={product.category}
          currentProductId={product._id}
        />
      )}
    </div>
  );
}