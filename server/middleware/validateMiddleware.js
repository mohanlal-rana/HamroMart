const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
//   console.log("🔹 Incoming request body:", req.body);

  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
    //   console.log("🔥 Zod validation errors:", err.issues); // <- note 'issues'

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // console.error("❌ Unexpected error in validate middleware:", err);
    next(err);
  }
};

module.exports = { validate };
