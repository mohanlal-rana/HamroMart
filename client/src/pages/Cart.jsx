import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../features/cartSlice";
import { fetchShippingAddress } from "../features/shippingSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user); // check login
  const { items, totalPrice, loading, error } = useSelector(
    (state) => state.cart
  );
  const shippingAddress = useSelector((state) => state.shipping.address);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
    dispatch(fetchShippingAddress());
  }, [dispatch, navigate, user]);
  if (!user) {
    navigate("/login");
    return;
  }
  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (items.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>
    );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = 140;

  const handleProceedToCheckout = () => {
    if (!shippingAddress) {
      alert("Please add a shipping address before proceeding!");
      navigate("/shipping-address-form");
      return;
    }

    const cartProducts = items.map(({ product, quantity }) => ({
      product,
      quantity,
    }));

    navigate("/checkout", { state: { cartProducts } });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Cart Table */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Cart 🛒</h2>
          <button
            onClick={() => dispatch(clearCart())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="hidden sm:grid grid-cols-6 gap-4 p-2 font-semibold border-b border-gray-300">
          <div>Product</div>
          <div>Name</div>
          <div>Price</div>
          <div className="text-center">Quantity</div>
          <div>Total</div>
          <div>Actions</div>
        </div>

        {items.map(({ product, quantity }) => (
          <div
            key={product._id}
            className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 rounded-xl shadow-md bg-white items-center"
          >
            <div className="flex justify-center sm:justify-start">
              <Link to={`/product/${product._id}`}>
                <img
                  src={
                    product.images?.[0]?.url
                      ? `${import.meta.env.VITE_API_URL}${
                          product.images[0].url
                        }`
                      : "https://via.placeholder.com/80"
                  }
                  alt={product.name}
                  className="h-20 w-20 sm:h-16 sm:w-16 object-cover rounded-md hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            <div className="flex items-center">
              <Link
                to={`/product/${product._id}`}
                className="hover:underline text-gray-800"
              >
                {product.name}
              </Link>
            </div>

            <div className="flex items-center text-blue-600 font-semibold">
              Rs. {product.price}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: product._id,
                      action: "decrement",
                    })
                  )
                }
                className="px-2 py-1 border rounded-md disabled:opacity-50"
                disabled={quantity === 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: product._id,
                      action: "increment",
                    })
                  )
                }
                className="px-2 py-1 border rounded-md"
              >
                +
              </button>
            </div>

            <div className="flex items-center justify-center font-semibold">
              Rs. {product.price * quantity}
            </div>

            <div className="flex items-center justify-center">
              <FaTrashAlt
                className="cursor-pointer text-red-500 hover:text-red-600"
                onClick={() => dispatch(removeFromCart(product._id))}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Right: Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal ({totalItems} items)</span>
          <span>Rs. {totalPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping Fee</span>
          <span>Rs. {deliveryFee}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Voucher Code"
            className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            APPLY
          </button>
        </div>

        <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>Rs. {totalPrice + deliveryFee}</span>
        </div>

        <button
          onClick={handleProceedToCheckout}
          className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          PROCEED TO CHECKOUT ({totalItems})
        </button>
      </div>
    </div>
  );
}
