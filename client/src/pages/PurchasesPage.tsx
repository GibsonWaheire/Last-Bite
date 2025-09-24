import { useState } from "react";
import Navigation from "@/components/Navigation";
import PurchaseHistoryCard from "@/components/PurchaseHistoryCard";
import Footer from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, DollarSign, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { StaggeredContainer } from "@/components/animations";
import breadImage from "@/assets/bread.jpg";
import vegetablesImage from "@/assets/vegetables.jpg";
import dairyImage from "@/assets/dairy.jpg";

const PurchasesPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const mockPurchases = [
    {
      id: "purchase-001",
      foodName: "Artisan Sourdough Bread",
      store: "Baker's Corner",
      quantity: 2,
      price: 798,
      purchaseDate: "2024-12-15",
      status: "completed" as const,
      image: breadImage
    },
    {
      id: "purchase-002", 
      foodName: "Organic Mixed Vegetables",
      store: "Green Grocer",
      quantity: 1,
      price: 599,
      purchaseDate: "2024-12-14",
      status: "completed" as const,
      image: vegetablesImage
    },
    {
      id: "purchase-003",
      foodName: "Premium Dairy Bundle", 
      store: "Farm Fresh",
      quantity: 1,
      price: 799,
      purchaseDate: "2024-12-13",
      status: "pending" as const,
      image: dairyImage
    },
    {
      id: "purchase-004",
      foodName: "Whole Grain Pastries",
      store: "Baker's Corner", 
      quantity: 3,
      price: 897,
      purchaseDate: "2024-12-12",
      status: "completed" as const,
      image: breadImage
    },
    {
      id: "purchase-005",
      foodName: "Seasonal Fruit Mix",
      store: "Green Grocer",
      quantity: 2,
      price: 998,
      purchaseDate: "2024-12-11",
      status: "cancelled" as const,
      image: vegetablesImage
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const filteredPurchases = statusFilter === "all" 
    ? mockPurchases 
    : mockPurchases.filter(purchase => purchase.status === statusFilter);

  const totalSpent = mockPurchases
    .filter(p => p.status === "completed")
    .reduce((sum, purchase) => sum + purchase.price, 0);

  const totalOrders = mockPurchases.length;
  const completedOrders = mockPurchases.filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            My Purchases
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your food rescue purchases and order history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-fresh" />
            </div>
          </div>

          <div className="bg-gradient-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Orders</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold text-fresh">{formatCurrency(totalSpent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-fresh" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredPurchases.length} order{filteredPurchases.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Purchase History */}
        <StaggeredContainer className="space-y-4" staggerDelay={100}>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <PurchaseHistoryCard key={purchase.id} {...purchase} />
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter === "all" 
                  ? "You haven't made any purchases yet." 
                  : `No ${statusFilter} orders found.`}
              </p>
              <Button 
                variant="outline"
                onClick={() => setStatusFilter("all")}
              >
                View All Orders
              </Button>
            </div>
          )}
        </StaggeredContainer>

        {/* Recent Activity Summary */}
        {filteredPurchases.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Recent Activity Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Most Recent Purchase:</p>
                <p className="font-medium">
                  {filteredPurchases[0]?.foodName} from {filteredPurchases[0]?.store}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Order Value:</p>
                <p className="font-medium">
                  {formatCurrency(totalSpent / completedOrders)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PurchasesPage;
