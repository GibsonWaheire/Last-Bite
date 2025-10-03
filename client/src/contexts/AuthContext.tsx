// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, Auth } from 'firebase/auth';
import { auth } from '../firebase-config'; // <--- Import the initialized 'auth' object
import { userApi, User as BackendUser } from '../lib/api';

// Define user roles
export type UserRole = 'customer' | 'store_owner' | 'admin';

// Define the shape of the context data
interface AuthContextType {
  currentUser: User | null;
  auth: Auth; // Export the auth object for sign-up/in calls
  loading: boolean;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  backendUser: BackendUser | null;
  setBackendUser: (user: BackendUser | null) => void;
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);

  // Function to sync Firebase user with backend
  const syncUserWithBackend = async (firebaseUser: User, preserveRole: boolean = false) => {
    try {
      const backendUserData = await userApi.syncFirebaseUser(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      );
      setBackendUser(backendUserData);
      
      // Only set role if we're not preserving an existing role
      if (!preserveRole) {
        setUserRole(backendUserData.role as UserRole);
      }
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      // If backend sync fails, don't override existing role
      if (!preserveRole) {
        setUserRole(null);
        setBackendUser(null);
      }
    }
  };

  // This effect runs once to monitor the Firebase user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // If we already have a role set, preserve it during sync
        const shouldPreserveRole = userRole !== null;
        await syncUserWithBackend(user, shouldPreserveRole);
      } else {
        setUserRole(null);
        setBackendUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    auth,
    loading,
    userRole,
    setUserRole,
    backendUser,
    setBackendUser,
  };

  // While loading, you can return a spinner or null
  if (loading) {
    return <div>Loading authentication...</div>; 
    // You might replace this with a real loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
