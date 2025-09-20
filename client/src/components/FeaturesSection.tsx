import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Store, Heart, Clock, DollarSign, Leaf } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Smart Shopping",
      description: "Find discounted food items near you with our intelligent matching system.",
      color: "text-fresh"
    },
    {
      icon: Store,
      title: "Partner Stores",
      description: "Connect with local businesses committed to reducing food waste.",
      color: "text-warm"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications about new deals and expiry timers.",
      color: "text-golden"
    },
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Save up to 70% on quality groceries while helping the environment.",
      color: "text-fresh"
    },
    {
      icon: Heart,
      title: "Community Impact",
      description: "Join thousands of users making a positive impact on food waste.",
      color: "text-warm"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Every purchase helps reduce food waste and environmental impact.",
      color: "text-golden"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose FoodRescue?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're building a sustainable future, one rescued meal at a time. Join our community of conscious consumers and eco-friendly stores.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                    <Icon className={`h-6 w-6 text-white`} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;