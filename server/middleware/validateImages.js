// middleware/validateImages.js
const validateImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "At least one product image is required.",
      errors: [{ field: "images", message: "At least one image is required" }],
    });
  }
  next();
};

module.exports = {validateImages};