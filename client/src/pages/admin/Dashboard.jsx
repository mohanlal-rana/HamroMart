import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // <-- import Link
import {
  fetchDashboardStats,
  fetchRecentOrders,
} from "../../features/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, orders, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Total Orders</span>
          <span className="text-2xl font-bold">{stats?.totalOrders ?? 0}</span>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Pending Orders</span>
          <span className="text-2xl font-bold">
            {stats?.pendingOrders ?? 0}
          </span>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Total Products</span>
          <span className="text-2xl font-bold">
            {stats?.totalProducts ?? 0}
          </span>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Pending Products</span>
          <span className="text-2xl font-bold">
            {stats?.pendingProducts ?? 0}
          </span>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Users</span>
          <span className="text-2xl font-bold">{stats?.users ?? 0}</span>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <span className="text-gray-500">Pending Vendors</span>
          <span className="text-2xl font-bold">
            {stats?.pendingVendors ?? 0}
          </span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No recent orders found.</p>
        ) : (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">#{order._id.slice(-6)}</td>
                  <td className="py-2 px-4">{order.user?.name || "Unknown"}</td>
                  <td className="py-2 px-4">${order.totalPrice}</td>
                  <td
                    className={`py-2 px-4 ${
                      order.isDelivered
                        ? "text-green-600"
                        : order.isPaid
                        ? "text-blue-600"
                        : order.confirmed
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.isDelivered
                      ? "Delivered"
                      : order.isPaid
                      ? "Paid"
                      : order.confirmed
                      ? "Confirmed"
                      : "Pending"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/orders"
          className="bg-blue-50 text-blue-700 shadow rounded p-6 text-center cursor-pointer hover:bg-blue-100"
        >
          <h3 className="text-lg font-semibold mb-2">Manage Orders</h3>
          <p>View and process all customer orders.</p>
        </Link>

        <Link
          to="/admin/products"
          className="bg-green-50 text-green-700 shadow rounded p-6 text-center cursor-pointer hover:bg-green-100"
        >
          <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
          <p>Edit, add, or remove products from the store.</p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-purple-50 text-purple-700 shadow rounded p-6 text-center cursor-pointer hover:bg-purple-100"
        >
          <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
          <p>Approve vendors and manage user roles.</p>
        </Link>
      </div>
    </div>
  );
}
