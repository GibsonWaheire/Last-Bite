import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
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
import { CalendarIcon, Upload, Plus, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { foodListingValidationSchema, initialFoodListingValues } from "@/lib/validations";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { foodApi } from "@/lib/api";

const CreateListingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userRole, backendUser } = useAuth();

  // Check if user is authenticated and is a store owner
  useEffect(() => {
    if (!currentUser || userRole !== 'store_owner') {
      toast.error("Please sign in as a store owner to create listings.");
      navigate('/signin?role=store');
      return;
    }
  }, [currentUser, userRole, navigate]);

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

  // Get saved form data or use initial values
  const getInitialValues = () => {
    const savedData = localStorage.getItem('lastbite_draft_listing');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return { ...initialFoodListingValues, ...parsed };
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return initialFoodListingValues;
  };

  // Save form data to localStorage
  const saveDraft = (values: typeof initialFoodListingValues) => {
    try {
      localStorage.setItem('lastbite_draft_listing', JSON.stringify(values));
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  };

  const onSubmit = async (values: typeof initialFoodListingValues, { resetForm }: { resetForm: () => void }) => {
    setIsSubmitting(true);
    
    try {
      // Check authentication first
      if (!currentUser || !backendUser) {
        toast.error("Please sign in to create listings.");
        navigate('/signin?role=store');
        return;
      }

      // Prepare data for API
      const listingData = {
        ...values,
        user_id: backendUser.id, // Use authenticated user ID
        expiry_date: values.expiry_date ? new Date(values.expiry_date).toISOString().split('T')[0] : null
      };

      console.log("Creating listing:", listingData);
      
      // Call API
      const result = await foodApi.createFood({ 
        ...listingData,
        user_id: backendUser.id 
      });
      
      console.log("Listing created:", result);
      
      // Clear saved draft
      localStorage.removeItem('lastbite_draft_listing');
      
      // Reset form
      resetForm();
      
      toast.success("Food listing created successfully!");
      
      // Navigate to store dashboard
      navigate('/store-dashboard');
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // State to track form values for auto-save
  const [currentFormValues, setCurrentFormValues] = useState(getInitialValues());
  const [formValuesForSave, setFormValuesForSave] = useState(getInitialValues());

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDraft(formValuesForSave);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formValuesForSave]);

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
          
          {/* Draft Saved Notification */}
          {localStorage.getItem('lastbite_draft_listing') && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Your draft is automatically saved. Sign in to continue where you left off.
              </span>
            </div>
          )}
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
                initialValues={getInitialValues()}
                validationSchema={foodListingValidationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, errors, touched }) => {
                  // Update form values for auto-save using a timeout
                  const updateValuesAsync = () => {
                    setFormValuesForSave(values);
                  };
                  
                  // Schedule the update after render
                  setTimeout(updateValuesAsync, 0);
                  
                  return (
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
                    <Select value={values.category} onValueChange={(value) => setFieldValue("category", value)}>
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
                    <ErrorMessage name="category" component="p" className="text-sm text-red-500 mt-1" />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div>
                    <Label htmlFor="price">Price (KES) *</Label>
                    <Field
                      as={Input}
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="399.00"
                    />
                    <ErrorMessage name="price" component="p" className="text-sm text-red-500 mt-1" />
                  </div>
                </div>

                {/* Inventory & Expiry */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory & Expiry</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <ErrorMessage name="expiry_date" component="p" className="text-sm text-red-500 mt-1" />
                    </div>
                  </div>
                </div>

                {/* Authentication Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Store Owner Info</h3>
                  
                  <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Logged in as: {backendUser?.name || currentUser?.email} (Store Owner)
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => window.location.reload()}
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
                  );
                }}
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
