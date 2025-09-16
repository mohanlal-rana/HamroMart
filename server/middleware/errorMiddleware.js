const { ZodError } = require("zod");

const errorMiddleware = (err, req, res, next) => {
//   console.error("🔥 Error Middleware:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = Array.isArray(err.errors) ? err.errors : [];

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: fieldErrors.map((e) => ({
        field: e.path.join("."), // e.g. "password"
        message: e.message,
      })),
    });
  }

  // Generic app error
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
};

module.exports = errorMiddleware;
