const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// User API calls
export const userAPI = {
  getAll: () => apiCall('/users'),
  getById: (id: number) => apiCall(`/users/${id}`),
  create: (userData: { name: string }) => 
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  update: (id: number, userData: { name: string }) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  delete: (id: number) =>
    apiCall(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Food listing API calls
export const foodAPI = {
  getAll: () => apiCall('/foods'),
  getById: (id: number) => apiCall(`/foods/${id}`),
  create: (foodData: {
    name: string;
    user_id: number;
    stock: number;
    price: number;
    expiry_date?: string | null;
  }) =>
    apiCall('/foods', {
      method: 'POST',
      body: JSON.stringify(foodData),
    }),
  update: (id: number, foodData: {
    name?: string;
    stock?: number;
    price?: number;
    expiry_date?: string | null;
  }) =>
    apiCall(`/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData),
    }),
  delete: (id: number) =>
    apiCall(`/foods/${id}`, {
      method: 'DELETE',
    }),
};

// Purchase API calls
export const purchaseAPI = {
  getAll: () => apiCall('/purchases'),
  getById: (id: number) => apiCall(`/purchases/${id}`),
  create: (purchaseData: {
    user_id: number;
    food_id: number;
    quantity_bought: number;
  }) =>
    apiCall('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    }),
  update: (id: number, purchaseData: {
    quantity_bought: number;
  }) =>
    apiCall(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(purchaseData),
    }),
  delete: (id: number) =>
    apiCall(`/purchases/${id}`, {
      method: 'DELETE',
    }),
};
