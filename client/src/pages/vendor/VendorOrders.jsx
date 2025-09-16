import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorOrders } from "../../features/orderSlice";

export default function VendorOrders() {
  const dispatch = useDispatch();
  const { vendorOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchVendorOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vendorOrders.length === 0 ? (
        <p className="text-gray-500">No orders for your products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Products</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Total</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {vendorOrders.map((order) => {
                const vendorTotal = order.orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );

                return (
                  <tr key={order._id} className="border-t">
                    <td className="px-4 py-2 text-sm">{order._id.slice(-6)}</td>
                    <td className="px-4 py-2 text-sm">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-sm">
                      {order.orderItems.map((item) => (
                        <div key={item.product._id}>
                          {item.name} x {item.quantity} (Rs. {item.price})
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2 text-sm">Rs. {vendorTotal}</td>
                    <td className="px-4 py-2 text-sm">
                      {order.isPaid ? (
                        <span className="text-green-600 font-semibold">Paid</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {order.isDelivered ? (
                        <span className="text-green-600 font-semibold">Delivered</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
