import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Heart, User, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Cart from "./Cart";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import { toast } from "sonner";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide cart on store owner pages
  const isStoreOwnerPage = location.pathname.includes('store-owner') || 
                          location.pathname.includes('store-dashboard') ||
                          userRole === 'store_owner';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-orange-500 fill-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Last Bite
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {isStoreOwnerPage ? (
            <>
              <Link to="/store-dashboard" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/create-listing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Add Food
              </Link>
            </>
          ) : (
            <>
              <Link to="/listings" className="text-gray-700 hover:text-orange-600 transition-colors">
                Browse Food
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors">
                How It Works
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!isStoreOwnerPage && (
              <>
                <Cart />
                <Button variant="ghost" size="icon">
                  <Store className="h-5 w-5" />
                </Button>
              </>
            )}
            {currentUser ? (
              <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600">
                  <Link to="/signin">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300" asChild>
                  <Link to="/signup">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              {isStoreOwnerPage ? (
                <>
                  <Link 
                    to="/store-dashboard" 
                    className="block py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/create-listing" 
                    className="block py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Food
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/listings" 
                    className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Food
                  </Link>
                  <Link 
                    to="/how-it-works" 
                    className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                </>
              )}
            </div>
            
            {!isStoreOwnerPage && (
              <div className="pt-4 border-t space-y-2">
                <div className="w-full">
                  <Cart />
                </div>
                <Button variant="ghost" className="w-full justify-start">
                  <Store className="h-4 w-4 mr-2" />
                  Stores
                </Button>
              </div>
            )}
            
            <div className="pt-4 border-t space-y-2">
              {currentUser ? (
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-orange-600 hover:bg-orange-50" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600" asChild>
                    <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300" asChild>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;