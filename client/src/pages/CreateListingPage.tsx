import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CalendarIcon, Upload, Plus, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { foodListingSchema, type FoodListingFormData } from "@/lib/validations";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

const CreateListingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FoodListingFormData>({
    resolver: zodResolver(foodListingSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      originalPrice: "",
      discountedPrice: "",
      stock: "",
      expiryDate: undefined,
      store: "",
      image: ""
    }
  });

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

  const onSubmit = async (data: FoodListingFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create listing
      console.log("Creating listing:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      form.reset();
      
      toast.success("Food listing created successfully!");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Food Item Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Artisan Sourdough Bread"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the food item, its quality, and any special features..."
                      {...form.register("description")}
                      rows={3}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
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
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">Original Price (KES) *</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="899"
                        {...form.register("originalPrice")}
                      />
                      {form.formState.errors.originalPrice && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.originalPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="discountedPrice">Discounted Price (KES) *</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="399"
                        {...form.register("discountedPrice")}
                      />
                      {form.formState.errors.discountedPrice && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.discountedPrice.message}</p>
                      )}
                    </div>
                  </div>

                  {form.watch("originalPrice") && form.watch("discountedPrice") && (
                    <div className="text-sm text-muted-foreground">
                      Discount: {Math.round(((parseFloat(form.watch("originalPrice")) - parseFloat(form.watch("discountedPrice"))) / parseFloat(form.watch("originalPrice"))) * 100)}%
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
                        {...form.register("stock")}
                      />
                      {form.formState.errors.stock && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.stock.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Expiry Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !form.watch("expiryDate") && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.watch("expiryDate") ? format(form.watch("expiryDate")!, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.watch("expiryDate")}
                            onSelect={(date) => form.setValue("expiryDate", date)}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.expiryDate && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.expiryDate.message}</p>
                      )}
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
                      {...form.register("store")}
                    />
                    {form.formState.errors.store && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.store.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      {...form.register("image")}
                    />
                    {form.formState.errors.image && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.image.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-accent hover:shadow-soft"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Listing
                      </>
                    )}
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
