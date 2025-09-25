import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createListing } from "../api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const listingSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(1, "Stock must be at least 1"),
    expiryDate: Yup.date()
      .required("Expiry Date is required")
      .min(new Date(), "Expiry date cannot be in the past"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const listingData = { ...values };
      await createListing(listingData);
      toast.success("Listing created successfully!");
      resetForm();
      navigate("/user-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-2 border-fresh-200 shadow-lg animate-in fade-in zoom-in-50 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Create New Listing</CardTitle>
          <CardDescription>
            Fill out the details to create a new food item listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ title: "", description: "", price: "", stock: "", expiryDate: "" }}
            validationSchema={listingSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Field as={Input} type="text" name="title" id="title" placeholder="e.g., Fresh Organic Carrots" />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field as={Textarea} name="description" id="description" placeholder="A brief description of your food item." />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Field as={Input} type="number" name="price" id="price" placeholder="0.00" step="0.01" />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Field as={Input} type="number" name="stock" id="stock" placeholder="10" />
                  <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Field as={Input} type="date" name="expiryDate" id="expiryDate" />
                  <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <Button type="submit" className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" disabled={isSubmitting || loading}>
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListingPage;