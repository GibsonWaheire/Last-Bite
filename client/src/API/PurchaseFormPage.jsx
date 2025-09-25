import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { fetchListingById, submitPurchase } from "../api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Declare global variables for TypeScript to recognize them
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const PurchasePage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const getListing = async () => {
      try {
        const fetchedListing = await fetchListingById(listingId);
        setListing(fetchedListing);
      } catch (error) {
        toast.error(error.message || "Failed to fetch listing details.");
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (listingId) {
      getListing();
    }
  }, [listingId, navigate]);

  if (!user) {
    navigate("/signin");
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Listing not found.</p>
      </div>
    );
  }

  const purchaseSchema = Yup.object().shape({
    quantity: Yup.number()
      .required("Quantity is required")
      .integer("Quantity must be an integer")
      .min(1, "Quantity must be at least 1")
      .max(listing.stock, `Quantity cannot exceed available stock of ${listing.stock}`),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const purchaseData = {
        ...values,
        listingId: listing.id,
        buyerId: user.uid,
      };
      await submitPurchase(purchaseData);
      toast.success("Purchase successful!");
      navigate("/user-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to complete purchase.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 border-fresh-200 shadow-lg animate-in fade-in zoom-in-50 duration-500">
        <CardHeader>
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription>
            {listing.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">Price: <span className="text-lg font-semibold text-fresh">${listing.price}</span></p>
            <p className="text-sm text-muted-foreground">Available Stock: <span className="text-lg font-semibold text-fresh">{listing.stock}</span></p>
          </div>
          <Formik
            initialValues={{ quantity: 1 }}
            validationSchema={purchaseSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Field as={Input} type="number" name="quantity" id="quantity" />
                  <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Purchasing..." : `Buy for $${(listing.price * (parseInt(document.getElementById('quantity')?.value) || 1)).toFixed(2)}`}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter>
          <Link to="/user-dashboard" className="text-sm text-muted-foreground hover:underline">
            Cancel
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PurchasePage;
