import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { fetchCart } from "../features/cartSlice";
import { FiSearch, FiShoppingCart, FiHome, FiUser, FiPackage, FiX } from "react-icons/fi";
import Profile from "./Profile";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setDrawerOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Top Bar - Search & Logo */}
      <header className="bg-blue-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-wide">
            HamroMart
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-6 justify-center"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-l-full focus:outline-none text-black bg-white"
            />
            <button
              type="submit"
              className="bg-yellow-400 px-4 py-2 rounded-r-full text-black hover:bg-yellow-300 transition-colors flex items-center justify-center"
            >
              <FiSearch size={20} />
            </button>
          </form>

          {/* Desktop Profile + Cart */}
          <div className="hidden md:flex items-center space-x-6 text-lg font-medium">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-yellow-400 px-4 py-2 rounded-lg text-black hover:bg-yellow-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <Profile user={user} handleLogout={handleLogout} />
                <Link
                  to="/cart"
                  className="relative hover:text-yellow-400 transition-colors duration-200"
                >
                  <FiShoppingCart size={24} />
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {totalCartQuantity}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-400">
                  Login
                </Link>
                <Link to="/signup" className="hover:text-yellow-400 font-semibold">
                  Sign Up
                </Link>
                <Link to="/cart" className="relative hover:text-yellow-400">
                  <FiShoppingCart size={24} />
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {totalCartQuantity}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden bg-blue-600 p-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white px-4 py-2 rounded-l-full text-black focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="bg-yellow-400 px-4 py-2 rounded-r-full text-black hover:bg-yellow-300 transition-colors flex items-center justify-center"
            >
              <FiSearch size={20} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-2 z-50">
        <Link
          to="/"
          className={`flex flex-col items-center text-sm ${
            location.pathname === "/" ? "text-blue-500 font-bold" : "text-gray-600"
          }`}
        >
          <FiHome size={22} />
          Home
        </Link>

        {user ? (
          <>
            {user.role === "admin" ? (
              <Link
                to="/admin"
                className={`flex flex-col items-center text-sm ${
                  location.pathname.startsWith("/admin")
                    ? "text-blue-500 font-bold"
                    : "text-gray-600"
                }`}
              >
                <FiUser size={22} />
                Admin
              </Link>
            ) : (
              <button
                onClick={() => setDrawerOpen(true)}
                className={`flex flex-col items-center text-sm ${
                  location.pathname.startsWith("/me")
                    ? "text-blue-500 font-bold"
                    : "text-gray-600"
                }`}
              >
                <FiUser size={22} />
                Me
              </button>
            )}

            <Link
              to="/my-orders"
              className={`flex flex-col items-center text-sm ${
                location.pathname.startsWith("/my-orders")
                  ? "text-blue-500 font-bold"
                  : "text-gray-600"
              }`}
            >
              <FiPackage size={22} />
              Orders
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center text-sm text-gray-600`}
          >
            <FiUser size={22} />
            Login
          </Link>
        )}

        <Link
          to="/cart"
          className={`flex flex-col items-center text-sm relative ${
            location.pathname === "/cart"
              ? "text-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          <FiShoppingCart size={22} />
          Cart
          {totalCartQuantity > 0 && (
            <span className="absolute top-0 right-3 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {totalCartQuantity}
            </span>
          )}
        </Link>
      </nav>

{/* Mobile Drawer */}
{drawerOpen && (
  <div className="md:hidden fixed top-16 bottom-16 left-0 right-0 z-40 flex">
    {/* Overlay over content area */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setDrawerOpen(false)}
    ></div>

    {/* Drawer Panel */}
    <div className="relative w-full bg-white/90 h-[40%] shadow-xl p-6 mt-6 flex flex-col space-y-6 transform transition-transform duration-300 ease-in-out animate-slide-in">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setDrawerOpen(false)}>
          <FiX size={24} className="text-gray-700 hover:text-red-500 fixed right-1" />
        </button>
      </div>

      {user ? (
        <>
          <Profile user={user} handleLogout={handleLogout} />
          {user.role === "customer" && (
            <div className="flex flex-col space-y-3 mt-4">
              <Link
                to="/vendor-form"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium"
              >
                Be a Vendor
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium"
              >
                Favourites
              </Link>
            </div>
          )}
          {user.role === "vendor" && (
            <div className="flex flex-col space-y-3 mt-4">
              <Link
                to="/vendor-home"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium"
              >
                Vendor Home
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium"
              >
                Favourites
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col space-y-3 mt-4">
          <Link
            to="/login"
            onClick={() => setDrawerOpen(false)}
            className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setDrawerOpen(false)}
            className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>

    {/* Animation Keyframes */}
    <style>
      {`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out forwards;
        }
      `}
    </style>
  </div>
)}



    </>
  );
}
