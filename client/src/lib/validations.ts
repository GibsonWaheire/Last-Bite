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

<<<<<<< Updated upstream
export type FoodListingFormData = z.infer<typeof foodListingSchema>;
=======
// Food listing validation schema
export const foodListingValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Food name is required')
    .max(100, 'Food name must be less than 100 characters')
    .required('Food name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  category: Yup.string()
    .required('Category is required'),
  user_id: Yup.number()
    .integer('User ID must be an integer')
    .positive('User ID must be positive')
    .required('User ID is required'),
  stock: Yup.number()
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  price: Yup.number()
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  expiry_date: Yup.date()
    .min(new Date(), 'Expiry date must be in the future')
    .nullable(),
});

// Purchase validation schema
export const purchaseValidationSchema = Yup.object({
  user_id: Yup.number()
    .integer('User ID must be an integer')
    .positive('User ID must be positive')
    .required('User ID is required'),
  food_id: Yup.number()
    .integer('Food ID must be an integer')
    .positive('Food ID must be positive')
    .required('Food ID is required'),
  quantity_bought: Yup.number()
    .integer('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
});

// Initial values for forms
export const initialUserValues = {
  name: '',
};

export const initialFoodListingValues = {
  name: '',
  description: '',
  category: '',
  user_id: 1,
  stock: 1,
  price: 0.0,
  expiry_date: null,
};

export const initialPurchaseValues = {
  user_id: 1,
  food_id: 1,
  quantity_bought: 1,
};
>>>>>>> Stashed changes
