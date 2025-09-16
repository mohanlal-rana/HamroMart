import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import VendorForm from "./pages/VendorForm";
import VendorLayout from "./components/layouts/VendorLayout";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProduct from "./pages/vendor/AddProduct";
import NotFound from "./pages/NotFound";
import EditProduct from "./pages/vendor/EditProduct";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";
import ShippingAddressForm from "./pages/ShippingAddressForm";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import UserDetail from "./pages/admin/UserDetail";
import SearchResults from "./pages/SearchResults";

function AppContent() {
  const location = useLocation();

  // Hide Header for vendor and admin pages
  const hideHeader =
    location.pathname.startsWith("/vendor-home") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyotp" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-form" element={<VendorForm />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/shop" element={<SearchResults />} />
        <Route path="/shipping-address-form" element={<ShippingAddressForm />} />
        <Route path="/my-orders" element={<OrdersPage />} />

        {/* Vendor nested routes */}
        <Route path="/vendor-home" element={<VendorLayout />}>
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
        </Route>

        {/* Admin nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="user-detail/:id" element={<UserDetail />} />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
