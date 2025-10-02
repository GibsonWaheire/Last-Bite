import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'sonner';
import { purchaseApi } from '../lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  store: string;
  image: string;
  category: string;
  expiryDate: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stock) }
            : item
        );
        
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.discountedPrice || 0) * item.quantity), 0);
        const totalSavings = updatedItems.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.discountedPrice || 0)) * item.quantity), 0);
        
        return {
          items: updatedItems,
          totalItems,
          totalPrice,
          totalSavings
        };
      } else {
        // Add new item
        const newItems = [...state.items, action.payload];
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + ((item.discountedPrice || 0) * item.quantity), 0);
        const totalSavings = newItems.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.discountedPrice || 0)) * item.quantity), 0);
        
        return {
          items: newItems,
          totalItems,
          totalPrice,
          totalSavings
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.discountedPrice || 0) * item.quantity), 0);
      const totalSavings = updatedItems.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.discountedPrice || 0)) * item.quantity), 0);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice,
        totalSavings
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(Math.max(action.payload.quantity, 0), item.stock) }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.discountedPrice || 0) * item.quantity), 0);
      const totalSavings = updatedItems.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.discountedPrice || 0)) * item.quantity), 0);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice,
        totalSavings
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        totalSavings: 0
      };
    
    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + ((item.discountedPrice || 0) * item.quantity), 0);
      const totalSavings = action.payload.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.discountedPrice || 0)) * item.quantity), 0);
      
      return {
        items: action.payload,
        totalItems,
        totalPrice,
        totalSavings
      };
    }
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalSavings: 0
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('foodrescue-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('foodrescue-cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart actions with toast notifications
export const useCartActions = () => {
  const { dispatch } = useCart();

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const cartItem: CartItem = { ...item, quantity: 1 };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const checkout = async () => {
    const { state } = useCart();
    const { backendUser } = useAuth();
    
    if (!backendUser) {
      toast.error('Please sign in to complete your purchase');
      return;
    }

    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Create purchase records for each item in cart
      for (const item of state.items) {
        await purchaseApi.createPurchase({
          user_id: backendUser.id,
          food_id: parseInt(item.id),
          quantity_bought: item.quantity,
          purchase_date: new Date().toISOString()
        });
      }

      // Clear cart after successful purchase
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Purchase completed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to complete purchase. Please try again.');
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout
  };
};
