import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListingsPage from "./pages/ListingsPage";
import CreateListingPage from "./pages/CreateListingPage";
import PurchasesPage from "./pages/PurchasesPage";
import HowItWorks from "./pages/HowItWorks";
import StoreDashboard from "./pages/StoreDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import StoreOwnerSignInPage from "./pages/StoreOwnerSignInPage";
import StoreOwnerSignUpPage from "./pages/StoreOwnerSignUpPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/store-dashboard" element={<StoreDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/store-owner-signin" element={<StoreOwnerSignInPage />} />
              <Route path="/store-owner-signup" element={<StoreOwnerSignUpPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
