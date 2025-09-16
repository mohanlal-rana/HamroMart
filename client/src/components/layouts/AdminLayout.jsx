import { Link, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { FaBox, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { logout } from "../../features/auth/authSlice"; // adjust path if needed

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // protect admin route
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-16"
        } bg-white shadow-lg flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`${open ? "text-lg font-bold" : "hidden"}`}>
            Admin Panel
          </h1>
          <FiMenu className="cursor-pointer" onClick={() => setOpen(!open)} />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaChartLine />
                {open && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaShoppingCart />
                {open && <span>Orders</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaBox />
                {open && <span>Products</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaUsers />
                {open && <span>Users</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FiHome />
                {open && <span>Home</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* child routes render here */}
        </main>
      </div>
    </div>
  );
}
