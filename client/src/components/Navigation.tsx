import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Heart, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cart from "./Cart";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 animate-in slide-in-from-top-2 duration-500">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-fresh fill-fresh" />
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            FoodRescue
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/listings" className="text-foreground hover:text-fresh transition-colors">
            Browse Food
          </Link>
          <Link to="/how-it-works" className="text-foreground hover:text-fresh transition-colors">
            How It Works
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Cart />
            <Button variant="ghost" size="icon" asChild>
              {/* Fix: Use asChild to render Link */}
              <Link to="/store-dashboard">
                <Store className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              {/* Fix: Use asChild to render Link */}
              <Link to="/signin">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
              {/* Fix: This button was missing the Link component */}
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
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
              <Link 
                to="/listings" 
                className="block py-2 text-foreground hover:text-fresh transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Food
              </Link>
              <Link 
                to="/how-it-works" 
                className="block py-2 text-foreground hover:text-fresh transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <div className="w-full">
                <Cart />
              </div>
              <Button variant="ghost" className="w-full justify-start" asChild>
                {/* Fix: Use asChild to render Link */}
                <Link to="/store-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Store className="h-4 w-4 mr-2" />
                  Stores
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                {/* Fix: Use asChild to render Link */}
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
                {/* Fix: This button was missing the Link component */}
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
