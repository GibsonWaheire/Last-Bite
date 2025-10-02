// API service for communicating with Flask backend

const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'store_owner' | 'admin';
  firebase_uid?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// User API functions
export const userApi = {
  // Sync Firebase user with backend
  async syncFirebaseUser(firebaseUid: string, email: string, name: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/sync-firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebase_uid: firebaseUid,
        email,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync user with backend');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/by-email/${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  },

  // Get user by Firebase UID
  async getUserByFirebaseUid(firebaseUid: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/by-firebase-uid/${firebaseUid}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  },

  // Get all users (for admin)
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const result: ApiResponse<User[]> = await response.json();
    return result.data;
  },

  // Create user
  async createUser(userData: { name: string; email: string; role: string; firebase_uid?: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  },
};

// Food listing API functions
export const foodApi = {
  // Get all food listings
  async getAllFoods(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/foods/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch food listings');
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data;
  },

  // Get food by ID
  async getFoodById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`);
    
    if (!response.ok) {
      throw new Error('Food listing not found');
    }

    const result: ApiResponse<any> = await response.json();
    return result.data;
  },

  // Create food listing
  async createFood(foodData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/foods/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error('Failed to create food listing');
    }

    const result: ApiResponse<any> = await response.json();
    return result.data;
  },
};

// Purchase API functions
export const purchaseApi = {
  // Get all purchases
  async getAllPurchases(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/purchases/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data;
  },

  // Create purchase
  async createPurchase(purchaseData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/purchases/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });

    if (!response.ok) {
      throw new Error('Failed to create purchase');
    }

    const result: ApiResponse<any> = await response.json();
    return result.data;
  },
};