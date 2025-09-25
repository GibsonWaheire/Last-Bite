// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, Auth } from 'firebase/auth';
import { auth } from '../firebase-config'; // <--- Import the initialized 'auth' object

// Define the shape of the context data
interface AuthContextType {
  currentUser: User | null;
  auth: Auth; // Export the auth object for sign-up/in calls
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect runs once to monitor the Firebase user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    auth,
    loading,
  };

  // While loading, you can return a spinner or null
  if (loading) {
    return <div>Loading authentication...</div>; 
    // You might replace this with a real loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};