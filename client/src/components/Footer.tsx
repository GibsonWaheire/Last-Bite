<<<<<<< Updated upstream
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-earth text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-fresh fill-fresh" />
              <span className="text-2xl font-bold">FoodRescue</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Connecting communities to reduce food waste and make quality food accessible to everyone. Together, we're building a more sustainable future.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-fresh transition-colors">Browse Food</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">For Stores</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">About Us</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-fresh transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60">
            &copy; 2024 FoodRescue. All rights reserved. Made with ❤️ for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};

=======
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-earth text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-fresh fill-fresh" />
              <span className="text-2xl font-bold">FoodRescue</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Connecting communities to reduce food waste and make quality food accessible to everyone. Together, we're building a more sustainable future.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-fresh">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/listings" className="hover:text-fresh transition-colors">Browse Food</Link></li>
              <li><Link to="/" className="hover:text-fresh transition-colors">How It Works</Link></li>
              <li><Link to="/create-listing" className="hover:text-fresh transition-colors">For Stores</Link></li>
              <li><Link to="/purchases" className="hover:text-fresh transition-colors">My Purchases</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-fresh transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-fresh transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60">
            &copy; 2024 FoodRescue. All rights reserved. Made with ❤️ for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};

>>>>>>> Stashed changes
export default Footer;