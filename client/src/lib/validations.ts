import * as Yup from 'yup';

// User validation schema
export const userValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
});

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
