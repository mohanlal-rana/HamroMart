const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// -------------------- AUTHENTICATE USER --------------------
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1].trim();

    // ✅ Decode the token first
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    // console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// -------------------- AUTHORIZE ADMIN --------------------
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Access denied. Admins only." });
};

// -------------------- AUTHORIZE VENDOR --------------------
const authorizeVendor = (req, res, next) => {
  if (req.user?.role !== "vendor") {
    return res.status(403).json({ message: "Vendor access only" });
  }

  // Remove verification check for now
  // if (req.user.vendor && !req.user.vendor.isVerified) {
  //   return res.status(403).json({ message: "Vendor not verified yet" });
  // }

  next();
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
  authorizeVendor,
};
