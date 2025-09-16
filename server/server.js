require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const productRouter=require("./router/productRouter");
const wishlistRouter = require("./router/wishlistRouter");
const cartRouter = require("./router/cartRouter");
const shippingRouter = require("./router/shippingRouter");
const orderRouter = require("./router/orderRounter");
const dashboardRouter = require("./router/dashboardRouter");
const invoiceRouter=require("./router/invoiceRouter")
const CONNECT_DB = require("./utils/db");
const path = require("path");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://hamromart.netlify.app",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // must be BEFORE your routes
app.use(express.urlencoded({ extended: true })); // optional, for form submissions



app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(errorMiddleware);

CONNECT_DB().then(()=>{
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
})

