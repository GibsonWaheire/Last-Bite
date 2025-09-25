import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Package, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Home,
  List,
  Activity,
  Store as StoreIcon,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState([
    {
      id: "1",
      name: "Artisan Sourdough Bread",
      originalPrice: 899,
      discountedPrice: 399,
      expiryDate: "2024-12-22",
      stock: 12,
      sold: 8,
      status: "active",
      category: "Bakery"
    },
    {
      id: "2", 
      name: "Organic Mixed Vegetables",
      originalPrice: 1299,
      discountedPrice: 599,
      expiryDate: "2024-12-23",
      stock: 8,
      sold: 5,
      status: "active",
      category: "Produce"
    },
    {
      id: "3",
      name: "Premium Dairy Bundle", 
      originalPrice: 1599,
      discountedPrice: 799,
      expiryDate: "2024-12-25",
      stock: 15,
      sold: 12,
      status: "active",
      category: "Dairy"
    }
  ]);

  // Calculate stats from listings
  const storeStats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === "active").length,
    soldItems: listings.reduce((sum, l) => sum + l.sold, 0),
    totalRevenue: listings.reduce((sum, l) => sum + (l.discountedPrice * l.sold), 0),
    wasteReduced: listings.reduce((sum, l) => sum + (l.sold * 0.5), 0), // Estimate 0.5kg per item
    avgDiscount: Math.round(listings.reduce((sum, l) => sum + ((l.originalPrice - l.discountedPrice) / l.originalPrice * 100), 0) / listings.length)
  };

  const urgentItems = listings.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2;
  });

  // Functional handlers
  const handleViewAnalytics = () => {
    toast.success("Analytics view opened!");
    setActiveTab("analytics");
  };

  const handleStoreSettings = () => {
    toast.info("Store settings panel would open here");
  };

  const handleViewListing = (id: string) => {
    const listing = listings.find(l => l.id === id);
    toast.success(`Viewing ${listing?.name}`);
  };

  const handleEditListing = (id: string) => {
    const listing = listings.find(l => l.id === id);
    toast.info(`Edit form for ${listing?.name} would open here`);
  };

  const handleDeleteListing = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (window.confirm(`Are you sure you want to delete "${listing?.name}"?`)) {
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success(`${listing?.name} deleted successfully`);
    }
  };

  const handleToggleListingStatus = (id: string) => {
    setListings(prev => prev.map(l => 
      l.id === id 
        ? { ...l, status: l.status === "active" ? "inactive" : "active" }
        : l
    ));
    const listing = listings.find(l => l.id === id);
    toast.success(`${listing?.name} status updated`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <StoreIcon className="h-6 w-6 text-fresh" />
              <span className="text-lg font-semibold">Store Dashboard</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "listings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("listings")}
            >
              <List className="h-4 w-4 mr-2" />
              My Listings
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button asChild className="w-full bg-gradient-hero hover:shadow-glow">
              <Link to="/create-listing">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Store Dashboard</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Store Owner Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Manage your food listings and track your impact
              </p>
            </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-gradient-hero hover:shadow-glow">
              <Link to="/create-listing">
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Link>
            </Button>
            <Button variant="outline" onClick={handleViewAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" onClick={handleStoreSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeStats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {storeStats.totalListings} total listings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeStats.soldItems}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(storeStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                From food rescue sales
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Reduced</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeStats.wasteReduced}kg</div>
              <p className="text-xs text-muted-foreground">
                Food saved from waste
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Items Alert */}
        {urgentItems.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Urgent Items - Expiring Soon!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {urgentItems.map((item) => {
                  const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.stock} items left • Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {daysLeft === 0 ? 'Expires Today' : `${daysLeft}d left`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content based on active tab */}
        {activeTab === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.map((item) => {
                    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Stock: {item.stock}</span>
                            <span>Sold: {item.sold}</span>
                            <span>Expires: {daysLeft}d left</span>
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-fresh">
                            {formatCurrency(item.discountedPrice)}
                          </span>
                          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
        )}

        {activeTab === "listings" && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.category} • Stock: {item.stock} • Sold: {item.sold}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewListing(item.id)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditListing(item.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteListing(item.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        )}

        {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Sales</span>
                      <span className="font-bold">{storeStats.soldItems} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue</span>
                      <span className="font-bold">{formatCurrency(storeStats.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Discount</span>
                      <span className="font-bold">{storeStats.avgDiscount}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Food Waste Prevented</span>
                      <span className="font-bold">{storeStats.wasteReduced}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Listings</span>
                      <span className="font-bold">{storeStats.activeListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-bold">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {activeTab === "listings" && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.category} • Stock: {item.stock} • Sold: {item.sold}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewListing(item.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditListing(item.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteListing(item.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Sales & Waste Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed analytics coming soon!</p>
              <div className="h-48 bg-muted rounded-md mt-4 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mr-2" />
                Charts & Reports
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Store settings panel coming soon!</p>
              <div className="h-48 bg-muted rounded-md mt-4 flex items-center justify-center text-muted-foreground">
                <Settings className="h-8 w-8 mr-2" />
                Settings Panel
              </div>
            </CardContent>
          </Card>
        )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StoreDashboard;
