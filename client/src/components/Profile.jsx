import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Profile({ user, handleLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Circle Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-200"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
          {/* User Name */}
          <p className="px-4 py-2 text-sm text-gray-600 border-b">
            {user.name}
          </p>

          {/* Be a Vendor button or Home link */}
          {user.role !== "vendor" && user.role !== "admin" ? (
            <button
              onClick={() => navigate("/vendor-form")}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
            >
              Be a Vendor
            </button>
          ) : user.role =="vendor" &&(
            <Link
              to="/vendor-home"
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 block"
            >
              Home
            </Link>
          )}
            <Link
              to="/wishlist"
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 block"
            >
             Favourite
            </Link>
               <Link
              to="/my-orders"
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 block"
            >
             my Orders
            </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
