import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import FoodListingCard from "@/components/FoodListingCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Loader2, SortAsc, SortDesc, SlidersHorizontal, Clock, Zap, AlertTriangle, MapPin } from "lucide-react";
import { FoodCardSkeleton } from "@/components/Skeletons";
import { ErrorBoundary, FoodGridErrorFallback } from "@/components/ErrorBoundary";
import { StaggeredContainer } from "@/components/animations";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import breadImage from "@/assets/bread.jpg";
import vegetablesImage from "@/assets/vegetables.jpg";
import dairyImage from "@/assets/dairy.jpg";

const ListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "discount" | "expiry">("expiry");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | "today" | "tomorrow" | "week" | "nearby">("all");

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

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate occasional errors (10% chance)
        if (Math.random() < 0.1) {
          throw new Error("Failed to load food listings");
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
        toast.error("Failed to load food listings");
      }
    };

    loadData();
  }, []);

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
    const matchesPriceRange = item.discountedPrice >= priceRange.min && item.discountedPrice <= priceRange.max;
    
    // Urgency filtering
    const urgencyLevel = getUrgencyLevel(item.expiryDate);
    const matchesUrgency = urgencyFilter === "all" || urgencyLevel === urgencyFilter;
    
    return matchesSearch && matchesCategory && matchesPriceRange && matchesUrgency;
  }).sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "price":
        comparison = a.discountedPrice - b.discountedPrice;
        break;
      case "discount": {
        const discountA = ((a.originalPrice - a.discountedPrice) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.discountedPrice) / b.originalPrice) * 100;
        comparison = discountA - discountB;
        break;
      }
      case "expiry":
        comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleAddToCart = (id: string) => {
    console.log(`Added item ${id} to cart`);
    toast.success("Item added to cart!");
    // TODO: Implement cart functionality
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    // Trigger useEffect to reload
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Browse Food Listings
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing deals on fresh food items from local stores
          </p>
        </div>

        {/* Search and Filter */}
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

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Urgency Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
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
            <Button
              variant={urgencyFilter === "nearby" ? "default" : "outline"}
              size="sm"
              onClick={() => setUrgencyFilter("nearby")}
              className="flex items-center"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Near Me
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {mockFoodItems.length} items
          </p>
        </div>

        {/* Food Listings Grid */}
        <ErrorBoundary fallback={FoodGridErrorFallback}>
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {Array.from({ length: 6 }).map((_, index) => (
                <FoodCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Filter className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Failed to load listings</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={retryLoad}>
                <Loader2 className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <StaggeredContainer 
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}
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
          )}

          {/* No Results */}
          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No food items found matching your criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </ErrorBoundary>
      </div>

      <Footer />
    </div>
  );
};

export default ListingsPage;
