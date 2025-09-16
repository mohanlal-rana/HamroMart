import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  markOrderDelivered,
  updateOrderPayment,
  confirmOrder,
} from "../../features/orderSlice";
import {
  generateInvoice,
  downloadInvoice,
  fetchInvoices,
} from "../../features/invoiceSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const { allOrders = [], loading, error } = useSelector((state) => state.orders);
  const { invoices = [], loading: invoiceLoading, error: invoiceError } = useSelector(
    (state) => state.invoice
  );

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleConfirmOrder = async (id) => {
    await dispatch(confirmOrder(id));
    await dispatch(fetchAllOrders());

    const order = allOrders.find((o) => o._id === id);

    const invoiceExists = invoices.find(
      (inv) =>
        inv.order._id?.toString() === id.toString() ||
        inv.order.toString() === id.toString()
    );

    if (order && !invoiceExists) {
      await dispatch(generateInvoice(id));
      await dispatch(fetchInvoices());
    }
  };

  const handleMarkPaid = async (id) => {
    await dispatch(updateOrderPayment(id));
    await dispatch(fetchAllOrders());
  };

  const handleMarkDelivered = async (id) => {
    await dispatch(markOrderDelivered(id));
    await dispatch(fetchAllOrders());
  };

  const handleDownloadInvoice = async (invoiceId) => {
    await dispatch(downloadInvoice(invoiceId));
  };

  const filteredOrders = allOrders.filter((order) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return !order.confirmed;
    if (statusFilter === "confirmed") return order.confirmed && !order.isPaid;
    if (statusFilter === "paid") return order.isPaid && !order.isDelivered;
    if (statusFilter === "delivered") return order.isDelivered;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="flex gap-2 mb-4">
        {["all", "pending", "confirmed", "paid", "delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {invoiceError && <p className="text-red-600 mb-4">{invoiceError}</p>}

      {filteredOrders.length === 0 && !loading ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Invoice</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const orderInvoice = invoices.find(
                  (inv) =>
                    inv.order._id?.toString() === order._id.toString() ||
                    inv.order.toString() === order._id.toString()
                );

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-4">{order._id.slice(-6)}</td>
                    <td className="py-2 px-4">{order.user?.name || "N/A"}</td>
                    <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          order.isDelivered
                            ? "bg-green-600"
                            : order.isPaid
                            ? "bg-blue-600"
                            : order.confirmed
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {order.isDelivered
                          ? "Delivered"
                          : order.isPaid
                          ? "Paid"
                          : order.confirmed
                          ? "Confirmed"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {orderInvoice ? (
                        <button
                          className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                          onClick={() => handleDownloadInvoice(orderInvoice._id)}
                        >
                          Download Invoice
                        </button>
                      ) : (
                        order.confirmed && <span className="text-gray-500">Generating...</span>
                      )}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      {!order.confirmed && (
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                          onClick={() => handleConfirmOrder(order._id)}
                        >
                          Confirm
                        </button>
                      )}
                      {order.confirmed && !order.isPaid && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          onClick={() => handleMarkPaid(order._id)}
                        >
                          Mark Paid
                        </button>
                      )}
                      {order.isPaid && !order.isDelivered && (
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          Mark Delivered
                        </button>
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
