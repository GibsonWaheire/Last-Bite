import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
          <Link to="/create-listing" className="text-foreground hover:text-fresh transition-colors">
            For Stores
          </Link>
          <Link to="/purchases" className="text-foreground hover:text-fresh transition-colors">
            My Purchases
          </Link>
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

export default Navigation;