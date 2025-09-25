<<<<<<< Updated upstream
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, TrendingDown } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFood})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <Leaf className="h-6 w-6 text-fresh" />
            <span className="text-fresh font-semibold">Reduce Food Waste</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Save Food,
            <span className="bg-gradient-hero bg-clip-text text-transparent block">
              Save Money
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            Connect with local stores to rescue perfectly good food at amazing prices. 
            Help reduce waste while saving up to 70% on groceries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
              Browse Deals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-fresh text-fresh hover:bg-fresh hover:text-white">
              For Store Owners
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-8 w-8 text-fresh" />
              </div>
              <div className="text-2xl font-bold text-fresh">40%</div>
              <div className="text-sm text-muted-foreground">Food Waste Reduced</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-warm" />
              </div>
              <div className="text-2xl font-bold text-warm">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-8 w-8 text-golden" />
              </div>
              <div className="text-2xl font-bold text-golden">500+</div>
              <div className="text-sm text-muted-foreground">Partner Stores</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

=======
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroFood from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFood})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <Leaf className="h-6 w-6 text-fresh" />
            <span className="text-fresh font-semibold">Reduce Food Waste</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Save Food,
            <span className="bg-gradient-hero bg-clip-text text-transparent block">
              Save Money
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            Connect with local stores to rescue perfectly good food at amazing prices. 
            Help reduce waste while saving up to 70% on groceries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
              <Link to="/listings">
                Browse Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-fresh text-fresh hover:bg-fresh hover:text-white" asChild>
              <Link to="/store-dashboard">
                For Store Owners
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-8 w-8 text-fresh" />
              </div>
              <div className="text-2xl font-bold text-fresh">40%</div>
              <div className="text-sm text-muted-foreground">Food Waste Reduced</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-warm" />
              </div>
              <div className="text-2xl font-bold text-warm">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-8 w-8 text-golden" />
              </div>
              <div className="text-2xl font-bold text-golden">500+</div>
              <div className="text-sm text-muted-foreground">Partner Stores</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

>>>>>>> Stashed changes
export default HeroSection;