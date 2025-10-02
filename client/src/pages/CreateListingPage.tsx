import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { foodListingValidationSchema, initialFoodListingValues } from "@/lib/validations";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

const CreateListingPage = () => {
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

  const onSubmit = async (values: typeof initialFoodListingValues, { resetForm }: { resetForm: () => void }) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create listing
      console.log("Creating listing:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      resetForm();
      
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
              <Formik
                initialValues={initialFoodListingValues}
                validationSchema={foodListingValidationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Food Item Name *</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="e.g., Artisan Sourdough Bread"
                    />
                    <ErrorMessage name="name" component="p" className="text-sm text-red-500 mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Describe the food item, its quality, and any special features..."
                      rows={3}
                    />
                    <ErrorMessage name="description" component="p" className="text-sm text-red-500 mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={values.category || ""} onValueChange={(value) => setFieldValue("category", value)}>
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
                    {errors.category && touched.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KES) *</Label>
                      <Field
                        as={Input}
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="399"
                      />
                      <ErrorMessage name="price" component="p" className="text-sm text-red-500 mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Field
                        as={Input}
                        id="stock"
                        name="stock"
                        type="number"
                        min="1"
                        placeholder="12"
                      />
                      <ErrorMessage name="stock" component="p" className="text-sm text-red-500 mt-1" />
                    </div>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expiry Date</h3>
                  
                  <div>
                    <Label>Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !values.expiry_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.expiry_date ? format(new Date(values.expiry_date), "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={values.expiry_date ? new Date(values.expiry_date) : undefined}
                          onSelect={(date) => setFieldValue("expiry_date", date)}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.expiry_date && touched.expiry_date && (
                      <p className="text-sm text-red-500 mt-1">{errors.expiry_date}</p>
                    )}
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">User Information</h3>
                  
                  <div>
                    <Label htmlFor="user_id">User ID *</Label>
                    <Field
                      as={Input}
                      id="user_id"
                      name="user_id"
                      type="number"
                      min="1"
                      placeholder="1"
                    />
                    <ErrorMessage name="user_id" component="p" className="text-sm text-red-500 mt-1" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setFieldValue("name", "")}
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
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateListingPage;

