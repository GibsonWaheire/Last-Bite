import { z } from "zod";

// Validation schema for food listing form
export const foodListingSchema = z.object({
  name: z.string()
    .min(1, "Food name is required")
    .min(3, "Food name must be at least 3 characters")
    .max(100, "Food name must be less than 100 characters"),
  
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  
  category: z.string()
    .min(1, "Category is required"),
  
  originalPrice: z.string()
    .min(1, "Original price is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Original price must be a valid positive number"),
  
  discountedPrice: z.string()
    .min(1, "Discounted price is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Discounted price must be a valid positive number"),
  
  stock: z.string()
    .min(1, "Stock quantity is required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Stock must be a valid positive integer"),
  
  expiryDate: z.date({
    required_error: "Expiry date is required",
  }).refine((date) => {
    return date > new Date();
  }, "Expiry date must be in the future"),
  
  store: z.string()
    .min(1, "Store name is required")
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters"),
  
  image: z.string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
}).refine((data) => {
  const originalPrice = parseFloat(data.originalPrice);
  const discountedPrice = parseFloat(data.discountedPrice);
  return discountedPrice < originalPrice;
}, {
  message: "Discounted price must be less than original price",
  path: ["discountedPrice"],
});

export type FoodListingFormData = z.infer<typeof foodListingSchema>;
