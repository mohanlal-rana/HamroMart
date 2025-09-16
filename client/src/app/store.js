import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminUserReducer from "../features/users/adminUserSlice";
import publicProductReducer from "../features/products/publicProductSlice";
import wishlistReducer from "../features/wishlistSlice";
import vendorProductReducer from "../features/products/vendorProductSlice";
import adminProductReducer from "../features/products/adminProductSlice";
import cartReducer from "../features/cartSlice";
import shippingReducer from "../features/shippingSlice";
import orderReducer from "../features/orderSlice";
import dashboardReducer from "../features/dashboardSlice";
import invoiceReducer from "../features/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUserReducer,
    cart: cartReducer,
    publicProducts: publicProductReducer,
    wishlist: wishlistReducer,
    adminProducts: adminProductReducer,
    vendorProducts: vendorProductReducer,
    shipping: shippingReducer,
    orders: orderReducer,
    dashboard: dashboardReducer,
    invoice: invoiceReducer,
  },
});
