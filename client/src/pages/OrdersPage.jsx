import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../features/orderSlice";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { userOrders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    //   console.log("Current user:", user);
    if (user?._id) {
      dispatch(fetchUserOrders(user._id));
    }
  }, [dispatch, user]);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        {error}
      </div>
    );

  if (!userOrders || userOrders.length === 0)
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        No orders yet!
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {userOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.isDelivered
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.isDelivered ? "Delivered" : "Pending"}
              </span>
            </div>

            {/* Order Items */}
            <ul className="space-y-3 mb-4">
              {order.orderItems.map((item) => (
                <li key={item._id} className="flex items-center gap-3">
                  <img
                    src={
                      item.image
                        ? `${import.meta.env.VITE_API_URL}${item.image}`
                        : "/placeholder.png"
                    }
                    alt={item.name || "Product"}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name || "Unknown Product"}
                    </p>
                    <p className="text-gray-500">Qty: {item.quantity || 1}</p>
                    <p className="text-gray-700 font-medium">
                      Rs{item.price || 0}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Order Total */}
            <div className="border-t pt-3 flex justify-between items-center text-gray-800 font-medium">
              <span>Total:</span>
              <span>Rs{order.totalPrice || 0}</span>
            </div>

            {/* Payment Status & Date */}
            <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
              <span>
                Paid:{" "}
                {order.isPaid ? (
                  <FaCheckCircle className="inline text-green-500" />
                ) : (
                  <FaTimesCircle className="inline text-red-500" />
                )}
              </span>
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
