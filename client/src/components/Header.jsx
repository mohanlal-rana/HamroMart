import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { fetchCart } from "../features/cartSlice";
import {
  FiSearch,
  FiShoppingCart,
  FiHome,
  FiUser,
  FiPackage,
  FiX,
  FiHeart,
} from "react-icons/fi";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const profileRef = useRef();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const totalCartQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
    setProfileOpen(false);
    navigate("/");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-lg font-medium">
            <Link
              to="/my-orders"
              className={`hover:text-yellow-400 transition-colors duration-200 ${
                location.pathname.startsWith("/my-orders")
                  ? "text-yellow-400"
                  : ""
              }`}
            >
              Orders
            </Link>

            <Link
              to="/cart"
              className={`relative hover:text-yellow-400 transition-colors duration-200 ${
                location.pathname === "/cart" ? "text-yellow-400" : ""
              }`}
            >
              <FiShoppingCart size={24} />
              {totalCartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalCartQuantity}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                    <Link
                      to="/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Favourites
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user.role === "vendor" && (
                      <Link
                        to="/vendor-home"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Link
                        to="/vendor-form"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Become a Vendor
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-400">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-yellow-400 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden bg-blue-600 p-2 shadow-inner">
          <form onSubmit={handleSearch} className="flex">
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
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-2 z-50">
        <Link
          to="/"
          className={`flex flex-col items-center text-sm transition-colors ${
            location.pathname === "/" ? "text-blue-500" : "text-gray-600"
          }`}
        >
          <FiHome size={22} />
          Home
        </Link>
        <Link
          to="/my-orders"
          className={`flex flex-col items-center text-sm transition-colors ${
            location.pathname.startsWith("/my-orders")
              ? "text-blue-500"
              : "text-gray-600"
          }`}
        >
          <FiPackage size={22} />
          Orders
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center text-sm relative transition-colors ${
            location.pathname === "/cart" ? "text-blue-500" : "text-gray-600"
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
        {user ? (
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center text-sm transition-colors ${
              drawerOpen ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <FiUser size={22} />
            Me
          </button>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center text-sm text-gray-600 transition-colors`}
          >
            <FiUser size={22} />
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          ></div>
       

          <div className="relative w-full bg-white/90 shadow-xl p-6 flex flex-col space-y-4 rounded-t-xl mt-auto transform transition-transform duration-300 ease-in-out animate-slide-up">
            <div className="flex justify-end items-center">
              <button onClick={() => setDrawerOpen(false)}>
                <FiX size={24} className="text-gray-700 hover:text-red-500" />
              </button>
            </div>

            {user && (
              <div className="flex items-center space-x-3 border-b pb-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
              <Link
                to="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium transition"
              >
                <FiHeart size={20} />
                <span>My Favourites</span>
              </Link>
              {user?.role === "customer" && (
                <Link
                  to="/vendor-form"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium transition"
                >
                  <FiPackage size={20} />
                  <span>Become a Vendor</span>
                </Link>
              )}
              {user?.role === "vendor" && (
                <Link
                  to="/vendor-home"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium transition"
                >
                  <FiPackage size={20} />
                  <span>Vendor Dashboard</span>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium transition"
                >
                  <FiUser size={20} />
                  <span>Admin Panel</span>
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
                >
                  <FiUser size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          <style>
            {`
              @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-up {
                animation: slide-up 0.25s ease-out forwards;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}
