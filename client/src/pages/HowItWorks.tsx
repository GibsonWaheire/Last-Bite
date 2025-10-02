import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Leaf,
  Store,
  Package,
  TrendingUp,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const HowItWorks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleStoreOwnerClick = () => {
    if (currentUser) {
      // User is authenticated, redirect to store dashboard
      navigate('/store-dashboard');
    } else {
      // User is not authenticated, redirect to sign in
      toast.info("Please sign in to access the store dashboard");
      navigate('/signin');
    }
  };
  const steps = [
    {
      icon: Search,
      title: "1. Browse & Search",
      description: "Find discounted food items near you. Use our urgency filters to see items expiring soon.",
      color: "text-blue-500"
    },
    {
      icon: ShoppingCart,
      title: "2. Add to Cart",
      description: "Select items you want to rescue. See real-time countdown timers for urgent items.",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "3. Save & Help",
      description: "Complete your purchase and help reduce food waste while saving money.",
      color: "text-red-500"
    }
  ];

  const storeSteps = [
    {
      icon: Store,
      title: "1. List Your Items",
      description: "Post food items that are close to expiry with discounted prices.",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "2. Track Sales",
      description: "Monitor your listings and see how much waste you've prevented.",
      color: "text-orange-500"
    },
    {
      icon: DollarSign,
      title: "3. Earn Revenue",
      description: "Recover costs on items that would otherwise go to waste.",
      color: "text-green-500"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Get quality food at up to 70% off regular prices",
      color: "text-green-500"
    },
    {
      icon: Leaf,
      title: "Reduce Waste",
      description: "Help prevent perfectly good food from going to landfills",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Join thousands making a positive environmental impact",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All items are fresh and safe to consume",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How FoodRescue Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A simple, effective way to reduce food waste while saving money. 
            Connect with local stores to rescue perfectly good food before it expires.
          </p>
        </div>

        {/* For Customers */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">For Customers</h2>
            <p className="text-lg text-muted-foreground">
              Discover amazing deals on fresh food items from local stores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-hero hover:shadow-glow">
              <Link to="/listings">
                Start Shopping Now
              </Link>
            </Button>
          </div>
        </section>

        {/* For Store Owners */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">For Store Owners</h2>
            <p className="text-lg text-muted-foreground">
              Turn potential waste into revenue while helping your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {storeSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-fresh text-fresh hover:bg-fresh hover:text-white"
              onClick={handleStoreOwnerClick}
            >
              Get Started as Store Owner
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose FoodRescue?</h2>
            <p className="text-lg text-muted-foreground">
              Join our mission to create a more sustainable future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center mb-4">
                      <Icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <Card className="bg-gradient-card">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-fresh mb-2">10k+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warm mb-2">500+</div>
                  <div className="text-muted-foreground">Partner Stores</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-golden mb-2">40%</div>
                  <div className="text-muted-foreground">Food Waste Reduced</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-fresh mb-2">KES 2M+</div>
                  <div className="text-muted-foreground">Money Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of people already reducing food waste and saving money
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/listings">
                    Start Shopping
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={handleStoreOwnerClick}
                >
                  Become a Partner Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
