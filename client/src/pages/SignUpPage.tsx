// src/pages/SignUpPage.tsx

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import your AuthContext hook
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth function
import { useNavigate } from 'react-router-dom'; // For redirection after sign-up
import { useToast } from '@/components/ui/use-toast'; // Your Shadcn UI Toaster

const SignUpPage: React.FC = () => {
  // Access the Firebase auth instance from your context
  const { auth, currentUser } = useAuth(); 
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize the toaster hook

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // To disable button during submission

  // Redirect if already logged in (optional, but good UX)
  // useEffect(() => {
  //   if (currentUser) {
  //     navigate('/user-dashboard'); // Or any other dashboard/home page
  //   }
  // }, [currentUser, navigate]);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true); // Disable button
    
    // Basic form validation
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Call the Firebase sign-up function
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Success feedback
      toast({
        title: "Registration Successful!",
        description: "Welcome to BiteMe! You are now logged in.",
      });

      // Redirect user to a dashboard or home page
      navigate('/user-dashboard'); // Adjust this path as needed

    } catch (error: any) {
      // Error feedback
      console.error("Firebase Sign Up Error:", error); // Log full error for debugging
      let errorMessage = "An unexpected error occurred during registration.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message) {
        errorMessage = error.message; // Use Firebase's message if available
      }

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up for BiteMe</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;