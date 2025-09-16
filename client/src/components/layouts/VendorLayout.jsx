import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { FaBox, FaShoppingCart, FaPlus } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { fetchCurrentUser, logout } from "../../features/auth/authSlice";

export default function VendorLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(true); // sidebar toggle

  // fetch user
  useEffect(() => {
    if (!token) return navigate("/login");
    dispatch(fetchCurrentUser()).finally(() => setChecked(true));
  }, [dispatch, token, navigate]);

  // check vendor role + verification
  useEffect(() => {
    if (!checked) return;

    if (!user) return navigate("/login");

    if (user.role !== "vendor") {
      alert("Access denied. Vendors only.");
      return navigate("/login");
    }

    if (!user.vendor?.isVerified) {
      alert(
        "Your vendor account is not verified yet. Please wait for admin approval."
      );
      return navigate("/");
    }
  }, [checked, user, navigate]);

  if (!checked || !user || user.role !== "vendor" || !user.vendor?.isVerified)
    return null;

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
            Vendor Panel
          </h1>
          <FiMenu className="cursor-pointer" onClick={() => setOpen(!open)} />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="orders"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaShoppingCart />
                {open && <span>Orders</span>}
              </Link>
            </li>
            <li>
              <Link
                to="products"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaBox />
                {open && <span>Products</span>}
              </Link>
            </li>
            <li>
              <Link
                to="products/add"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaPlus />
                {open && <span>Add Product</span>}
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
          <h2 className="text-lg font-semibold">Vendor Dashboard</h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
