<<<<<<< Updated upstream
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Heart, User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-fresh fill-fresh" />
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            FoodRescue
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-foreground hover:text-fresh transition-colors">
            Browse Food
          </a>
          <a href="#" className="text-foreground hover:text-fresh transition-colors">
            For Stores
          </a>
          <a href="#" className="text-foreground hover:text-fresh transition-colors">
            How It Works
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Store className="h-5 w-5" />
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

=======
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
            <Button variant="ghost" size="icon">
              <Store className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
              Get Started
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
              <Button variant="ghost" className="w-full justify-start">
                <Store className="h-4 w-4 mr-2" />
                Stores
              </Button>
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

>>>>>>> Stashed changes
export default Navigation;