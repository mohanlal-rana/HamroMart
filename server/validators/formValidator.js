const { z } = require("zod");

// Zod schema for VendorForm
const vendorSchema = z.object({
  shopName: z
    .string()
    .min(3, "Shop Name must be at least 3 characters")
    .max(50, "Shop Name cannot exceed 50 characters"),
  shopDescription: z
    .string()
    .min(10, "Shop Description must be at least 10 characters")
    .max(500, "Shop Description cannot exceed 500 characters"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9A-Z]{15}$/,
      "GST Number must be a valid 15-character alphanumeric code"
    ),
});

// products/schema.js
const productSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(3, "Product name must be at least 3 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  discount: z.coerce
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot be more than 100")
    .optional(),
  category: z.enum(
    ["electronics", "fashion", "books", "home-appliances", "sports"],
    {
      required_error: "Category is required",
    }
  ),
  // images field is removed from here
  features: z.array(z.string().min(1, "Feature cannot be empty")).optional(),
});
const updateProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").optional(),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0").optional(),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative").optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  category: z.enum(["electronics", "fashion", "books", "home-appliances", "sports"]).optional(),
  features: z.array(z.string().min(1, "Feature cannot be empty")).optional(),
  deletedImages: z.array(z.string().min(1)).optional(),
});

module.exports = { vendorSchema, productSchema , updateProductSchema};
