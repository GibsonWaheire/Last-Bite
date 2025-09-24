import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import FoodListingCard from "@/components/FoodListingCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { FoodCardSkeleton } from "@/components/Skeletons";
import { ErrorBoundary, FoodGridErrorFallback } from "@/components/ErrorBoundary";
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

  const mockFoodItems = [
    {
      id: "1",
      name: "Artisan Sourdough Bread",
      originalPrice: 8.99,
      discountedPrice: 3.99,
      expiryDate: "2024-12-22",
      store: "Baker's Corner",
      category: "Bakery",
      image: breadImage,
      stock: 12,
      description: "Freshly baked artisan sourdough bread with a crispy crust and soft interior."
    },
    {
      id: "2",
      name: "Organic Mixed Vegetables",
      originalPrice: 12.99,
      discountedPrice: 5.99,
      expiryDate: "2024-12-23",
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 8,
      description: "A mix of fresh organic vegetables including carrots, broccoli, and bell peppers."
    },
    {
      id: "3",
      name: "Premium Dairy Bundle",
      originalPrice: 15.99,
      discountedPrice: 7.99,
      expiryDate: "2024-12-25",
      store: "Farm Fresh",
      category: "Dairy",
      image: dairyImage,
      stock: 15,
      description: "Premium dairy products including milk, cheese, and yogurt."
    },
    {
      id: "4",
      name: "Whole Grain Pastries",
      originalPrice: 6.99,
      discountedPrice: 2.99,
      expiryDate: "2024-12-21",
      store: "Baker's Corner",
      category: "Bakery", 
      image: breadImage,
      stock: 6,
      description: "Delicious whole grain pastries perfect for breakfast or snacks."
    },
    {
      id: "5",
      name: "Seasonal Fruit Mix",
      originalPrice: 9.99,
      discountedPrice: 4.99,
      expiryDate: "2024-12-24",
      store: "Green Grocer",
      category: "Produce",
      image: vegetablesImage,
      stock: 20,
      description: "Fresh seasonal fruits including apples, oranges, and bananas."
    },
    {
      id: "6",
      name: "Gourmet Cheese Selection",
      originalPrice: 18.99,
      discountedPrice: 8.99,
      expiryDate: "2024-12-26",
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

  const filteredItems = mockFoodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredItems.map((item) => (
                <FoodListingCard 
                  key={item.id} 
                  {...item} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
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
