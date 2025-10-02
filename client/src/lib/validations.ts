import * as Yup from 'yup';

// User validation schema
export const userValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
});

<<<<<<< HEAD
=======
// Authentication validation schemas
export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signUpValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

>>>>>>> Gibson
// Food listing validation schema
export const foodListingValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Food name is required')
    .max(100, 'Food name must be less than 100 characters')
    .required('Food name is required'),
  description: Yup.string()
<<<<<<< HEAD
    .max(500, 'Description must be less than 500 characters'),
  category: Yup.string()
    .required('Category is required'),
  user_id: Yup.number()
    .integer('User ID must be an integer')
    .positive('User ID must be positive')
    .required('User ID is required'),
=======
    .max(500, 'Description must be less than 500 characters')
    .nullable(),
  category: Yup.string()
    .required('Category is required'),
>>>>>>> Gibson
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

<<<<<<< HEAD
=======
export const initialSignInValues = {
  email: '',
  password: '',
};

export const initialSignUpValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

>>>>>>> Gibson
export const initialFoodListingValues = {
  name: '',
  description: '',
  category: '',
<<<<<<< HEAD
  user_id: 1,
=======
>>>>>>> Gibson
  stock: 1,
  price: 0.0,
  expiry_date: null,
};

export const initialPurchaseValues = {
  user_id: 1,
  food_id: 1,
  quantity_bought: 1,
<<<<<<< HEAD
};
=======
};
>>>>>>> Gibson
