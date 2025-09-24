import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateListingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    originalPrice: "",
    discountedPrice: "",
    stock: "",
    expiryDate: undefined as Date | undefined,
    store: "",
    image: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Bakery",
    "Produce", 
    "Dairy",
    "Meat",
    "Seafood",
    "Pantry",
    "Frozen",
    "Beverages",
    "Snacks"
  ];

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create listing
      console.log("Creating listing:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        originalPrice: "",
        discountedPrice: "",
        stock: "",
        expiryDate: undefined,
        store: "",
        image: ""
      });
      
      alert("Food listing created successfully!");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && 
                     formData.category && 
                     formData.originalPrice && 
                     formData.discountedPrice && 
                     formData.stock && 
                     formData.expiryDate &&
                     formData.store;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create Food Listing
          </h1>
          <p className="text-lg text-muted-foreground">
            List your food items for customers to discover and purchase
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Food Item Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Food Item Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Artisan Sourdough Bread"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the food item, its quality, and any special features..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">Original Price ($) *</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="8.99"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="discountedPrice">Discounted Price ($) *</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="3.99"
                        value={formData.discountedPrice}
                        onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {formData.originalPrice && formData.discountedPrice && (
                    <div className="text-sm text-muted-foreground">
                      Discount: {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.discountedPrice)) / parseFloat(formData.originalPrice)) * 100)}%
                    </div>
                  )}
                </div>

                {/* Inventory & Expiry */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory & Expiry</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="1"
                        placeholder="12"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Expiry Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.expiryDate}
                            onSelect={(date) => handleInputChange("expiryDate", date)}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Store Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Store Information</h3>
                  
                  <div>
                    <Label htmlFor="store">Store Name *</Label>
                    <Input
                      id="store"
                      placeholder="e.g., Baker's Corner"
                      value={formData.store}
                      onChange={(e) => handleInputChange("store", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!isFormValid || isSubmitting}
                    className="bg-gradient-accent hover:shadow-soft"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateListingPage;
