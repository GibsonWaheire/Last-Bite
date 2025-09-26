import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { initializeApp } from "firebase/app";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "../firebase-config";
import { LogOut, Plus } from "lucide-react";
// Update the import path to the correct location of your API functions
// Update the import path to the correct location of your API functions
// Update the import path below to the correct location of your API functions
// Update the import path below to the correct location of your API functions
import { fetchListings, fetchPurchaseHistory } from "../API/api.js";

// Declare global variables for TypeScript to recognize them
declare const __firebase_config: string;
declare const __initial_auth_token: string;

// const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        navigate("/signin");
        toast.error("You have been signed out.");
      } else {
        try {
          const fetchedListings = await fetchListings();
          setListings(fetchedListings);
          const fetchedHistory = await fetchPurchaseHistory(currentUser.uid);
          setPurchaseHistory(fetchedHistory);
        } catch (error) {
          toast.error(error.message || "Failed to load data.");
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
    }
  
  if (!user) {
    return null; // The redirect is handled in useEffect
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-4">
      <Card className="w-full max-w-4xl border-2 border-fresh-200 shadow-lg animate-in fade-in zoom-in-50 duration-500">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight">User Dashboard</CardTitle>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2 flex items-center justify-between">
              Available Listings
              <Link to="/create-listing">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </Link>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <Card key={listing.id} className="p-4 border-2">
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{listing.description}</p>
                    <p className="text-sm font-medium mt-2">Price: ${listing.price}</p>
                    <p className="text-sm font-medium">Stock: {listing.stock}</p>
                    <Link to={`/purchase/${listing.id}`}>
                      <Button className="w-full mt-4">Purchase</Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No listings available.</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Your Purchase History</h2>
            <div className="grid gap-4">
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((purchase) => (
                  <Card key={purchase.id} className="p-4 border-2">
                    <p className="text-lg font-semibold">{purchase.listingTitle}</p>
                    <p className="text-muted-foreground text-sm">Quantity: {purchase.quantity}</p>
                    <p className="text-muted-foreground text-sm">Total: ${purchase.totalPrice}</p>
                    <p className="text-muted-foreground text-sm">Date: {new Date(purchase.date).toLocaleDateString()}</p>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">You have no purchase history.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;