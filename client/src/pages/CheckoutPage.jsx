import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShippingAddress } from "../features/shippingSlice";
import { createOrder, resetOrderState } from "../features/orderSlice";
import { FiEdit } from "react-icons/fi";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine if single product or cart checkout
  const singleProduct = location.state?.product;
  const quantity = location.state?.quantity || 1;
  const cartProducts = location.state?.cartProducts || [];

  // Create unified products array
  const productsToCheckout = singleProduct
    ? [{ product: singleProduct, quantity }]
    : cartProducts;

  const { address: shippingAddress, loading: shippingLoading } = useSelector(
    (state) => state.shipping
  );

  const { order, loading: orderLoading, success } = useSelector(
    (state) => state.orders
  );

  const [voucherCode, setVoucherCode] = useState("");

  useEffect(() => {
    dispatch(fetchShippingAddress());
  }, [dispatch]);

  // Redirect to order success page after order is placed
  useEffect(() => {
    if (success && order?._id) {
      navigate(`/order-success/${order._id}`);
      dispatch(resetOrderState()); // reset order state after redirect
    }
  }, [success, order, navigate, dispatch]);

  // Calculate totals
  const subtotal = productsToCheckout.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = 140;
  const total = subtotal + deliveryFee;

  // Handle placing order
const handlePlaceOrder = async () => {
  if (!shippingAddress) {
    alert("Please add a shipping address before placing order.");
    return;
  }

  const orderData = {
    orderItems: productsToCheckout.map(({ product, quantity }) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      quantity,
    })),
    shippingAddress,
    itemsPrice: subtotal,
    shippingPrice: deliveryFee,
    totalPrice: total,
    paymentMethod: "COD", // Cash on delivery
  };

  try {
    // Dispatch and wait for success
    const resultAction = await dispatch(createOrder(orderData));

    // Check if fulfilled
    if (createOrder.fulfilled.match(resultAction)) {
      navigate("/"); // Redirect to home
      alert("Order placed successfully!");
      dispatch(resetOrderState()); // Reset Redux order state
    } else {
      alert("Failed to place order. Please try again.");
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
};


  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Shipping Info + Products */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Info */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <button
              onClick={() => navigate("/shipping-address-form")}
              className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
            >
              <FiEdit /> {shippingAddress ? "EDIT" : "ADD"}
            </button>
          </div>

          {shippingLoading ? (
            <p>Loading shipping address...</p>
          ) : shippingAddress ? (
            <>
              <p className="font-medium">
                {shippingAddress.fullName} | {shippingAddress.phone}
              </p>
              <p>
                {shippingAddress.landmark && `${shippingAddress.landmark}, `}
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`},{" "}
                {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.country}
              </p>
            </>
          ) : (
            <p className="text-red-500">No shipping address added. Please add one.</p>
          )}
        </div>

        {/* Products Info */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          {productsToCheckout.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="grid grid-cols-12 gap-4 items-center border-b pb-4"
            >
              <img
                src={
                  product.images?.[0]?.url
                    ? `${import.meta.env.VITE_API_URL}${product.images[0].url}`
                    : "https://via.placeholder.com/80"
                }
                alt={product.name}
                className="col-span-3 h-20 w-20 object-cover rounded-md"
              />
              <div className="col-span-6">
                <p className="font-medium">{product.name}</p>
                <p className="text-gray-500 text-sm">
                  {product.brand || "No Brand"}, Color: {product.color || "N/A"}
                </p>
                <p className="text-gray-700 font-semibold">Rs. {product.price}</p>
              </div>
              <div className="col-span-3 flex flex-col items-end">
                <p>Qty: {quantity}</p>
              </div>
            </div>
          ))}

          {/* Voucher */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Enter Store/Daraz Code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
            />
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              APPLY
            </button>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold mb-4">Order Detail</h2>
        <div className="flex justify-between">
          <span>Items Total</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>Rs. {deliveryFee}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
        <p className="text-gray-500 text-sm">All taxes included</p>

        <button
          className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handlePlaceOrder}
          disabled={orderLoading}
        >
          {orderLoading ? "Processing..." : "PROCEED TO PAYMENT"}
        </button>
      </div>
    </div>
  );
}
