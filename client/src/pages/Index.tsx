import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FoodListingCard from "@/components/FoodListingCard";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Clock, Zap, AlertTriangle, MapPin } from "lucide-react";
import { StaggeredContainer } from "@/components/animations";
import { useCartActions } from "@/contexts/CartContext";
import { toast } from "sonner";
import breadImage from "@/assets/bread.jpg";
import vegetablesImage from "@/assets/vegetables.jpg";
import dairyImage from "@/assets/dairy.jpg";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | "today" | "tomorrow" | "week">("all");
  const { addToCart } = useCartActions();

  const mockFoodItems = [
    {
      id: "1",
      name: "Artisan Sourdough Bread",
      originalPrice: 899,
      discountedPrice: 399,
      expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 hours from now
      store: "Baker's Corner",
      category: "Bakery",
      image: breadImage,
      stock: 12,
      description: "Freshly baked artisan sourdough bread with a crispy crust and soft interior."
    },
    {
      id: "2",
      name: "Organic Mixed Vegetables",
      originalPrice: 1299,
      discountedPrice: 599,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 8,
      description: "A mix of fresh organic vegetables including carrots, broccoli, and bell peppers."
    },
    {
      id: "3",
      name: "Premium Dairy Bundle",
      originalPrice: 1599,
      discountedPrice: 799,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      store: "Farm Fresh",
      category: "Dairy",
      image: dairyImage,
      stock: 15,
      description: "Premium dairy products including milk, cheese, and yogurt."
    },
    {
      id: "4",
      name: "Whole Grain Pastries",
      originalPrice: 699,
      discountedPrice: 299,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      store: "Baker's Corner",
      category: "Bakery",
      image: breadImage,
      stock: 6,
      description: "Delicious whole grain pastries perfect for breakfast or snacks."
    },
    {
      id: "5",
      name: "Seasonal Fruit Mix",
      originalPrice: 999,
      discountedPrice: 499,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 20,
      description: "Fresh seasonal fruits including apples, oranges, and bananas."
    },
    {
      id: "6",
      name: "Gourmet Cheese Selection",
      originalPrice: 1899,
      discountedPrice: 899,
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
      store: "Farm Fresh",
      category: "Dairy",
      image: dairyImage,
      stock: 4,
      description: "A selection of gourmet cheeses from local and international producers."
    }
  ];

  const categories = ["all", "Bakery", "Produce", "Dairy"];

  // Helper function to calculate urgency level
  const getUrgencyLevel = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return "expired";
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays <= 7) return "week";
    return "normal";
  };

  const filteredItems = mockFoodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    // Urgency filtering
    const urgencyLevel = getUrgencyLevel(item.expiryDate);
    const matchesUrgency = urgencyFilter === "all" || urgencyLevel === urgencyFilter;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  }).sort((a, b) => {
    // Sort by urgency first, then by expiry date
    const urgencyA = getUrgencyLevel(a.expiryDate);
    const urgencyB = getUrgencyLevel(b.expiryDate);
    
    const urgencyOrder = { "today": 0, "tomorrow": 1, "week": 2, "normal": 3, "expired": 4 };
    const urgencyComparison = urgencyOrder[urgencyA as keyof typeof urgencyOrder] - urgencyOrder[urgencyB as keyof typeof urgencyOrder];
    
    if (urgencyComparison !== 0) return urgencyComparison;
    
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  const handleAddToCart = (id: string) => {
    const item = mockFoodItems.find(item => item.id === id);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        originalPrice: item.originalPrice,
        discountedPrice: item.discountedPrice,
        store: item.store,
        image: item.image,
        category: item.category,
        expiryDate: item.expiryDate,
        stock: item.stock
      });
      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Featured Food Rescues Section */}
      <section className="py-16 bg-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Today's Food Rescues
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh, quality food at incredible prices. Help us reduce waste while you save money on your groceries.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food items or stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Filter Buttons */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={urgencyFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgencyFilter("all")}
                className="flex items-center"
              >
                <Clock className="h-4 w-4 mr-1" />
                All Items
              </Button>
              <Button
                variant={urgencyFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgencyFilter("today")}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white border-red-500"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Expires Today
              </Button>
              <Button
                variant={urgencyFilter === "tomorrow" ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgencyFilter("tomorrow")}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              >
                <Zap className="h-4 w-4 mr-1" />
                Expires Tomorrow
              </Button>
              <Button
                variant={urgencyFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgencyFilter("week")}
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500"
              >
                <Clock className="h-4 w-4 mr-1" />
                This Week
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {mockFoodItems.length} items
            </p>
          </div>
          
          {/* Food Listings Grid */}
          <StaggeredContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={150}
          >
            {filteredItems.map((item) => (
              <FoodListingCard 
                key={item.id} 
                {...item} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </StaggeredContainer>
          
          <div className="text-center mt-12">
            <Button asChild className="text-fresh font-semibold hover:underline bg-transparent">
              <a href="/listings">
                View All Available Food →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
