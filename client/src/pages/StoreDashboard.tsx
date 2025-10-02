import { useState, useEffect } from "react";
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
  X,
  ShoppingCart,
  User,
  LogOut,
  Bell,
  Receipt,
  Target,
  Zap,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Repeat,
  Truck,
  Timer,
  TrendingDown,
  ChefHat,
  ShieldCheck,
  Clock3,
  PieChart,
  AlertCircle,
  Star,
  StarIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import { purchaseApi, foodApi, userApi } from "@/lib/api";

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrdersCount, setNewOrdersCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order #1234 received", time: "5 min ago", urgent: true },
    { id: 2, message: "Inventory low for Bread", time: "1 hour ago", urgent: false },
    { id: 3, message: "Customer review received", time: "2 hours ago", urgent: false }
  ]);
  const { currentUser, userRole, backendUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not a store owner
  useEffect(() => {
    if (!currentUser) {
      navigate('/store-owner-signin');
    } else if (userRole !== 'store_owner') {
      toast.error("Access denied. This page is for store owners only.");
      navigate('/');
    }
  }, [currentUser, userRole, navigate]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!backendUser) return;
      
      try {
        setLoading(true);
        const purchases = await purchaseApi.getAllPurchases();
        
        // Filter purchases for this store owner's food listings
        const storeOrders = purchases.filter((purchase: any) => {
          // This would need to be enhanced to check if the food belongs to this store owner
          return true; // For now, show all orders
        });

        // Transform purchases into order format
        const transformedOrders = storeOrders.map((purchase: any, index: number) => ({
          id: purchase.id,
          customerName: `Customer ${purchase.user_id}`,
          customerEmail: `customer${purchase.user_id}@example.com`,
          items: [
            {
              name: `Food Item ${purchase.food_id}`,
              quantity: purchase.quantity_bought,
              price: 10.99 // This should come from the food listing
            }
          ],
          total: purchase.quantity_bought * 10.99,
          status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'completed' : 'cancelled',
          orderDate: new Date(purchase.purchase_date).toLocaleDateString(),
          pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };
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


  // Calculate stats from listings and orders
  const storeStats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === "active").length,
    soldItems: listings.reduce((sum, l) => sum + l.sold, 0),
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0),
    wasteReduced: listings.reduce((sum, l) => sum + (l.sold * 0.5), 0), // Estimate 0.5kg per item
    avgDiscount: Math.round(listings.reduce((sum, l) => sum + ((l.originalPrice - l.discountedPrice) / l.originalPrice * 100), 0) / listings.length),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length
  };

  const urgentItems = listings.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2;
  });

  // Order handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    const order = orders.find(o => o.id === orderId);
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    toast.success(`Viewing order ${orderId} for ${order?.customerName}`);
  };

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
            {/* Overview Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                🏪 Business Hub
              </div>
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className="w-full justify-start relative"
                onClick={() => setActiveTab("orders")}
              >
                <Bell className="h-4 w-4 mr-2" />
                Orders
                {newOrdersCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-4 w-4 p-0 text-xs flex items-center justify-center">
                    {newOrdersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Operations Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                ⚙️ Operations
              </div>
              <Button
                variant={activeTab === "listings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("listings")}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </Button>
            </div>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
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
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeStats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                {storeStats.totalOrders} total orders
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeStats.completedOrders}</div>
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
                From completed orders
              </p>
            </CardContent>
          </Card>

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
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Orders Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">📦 Order Management</h2>
                <p className="text-gray-600 mt-1">
                  Track orders, manage fulfillment, and delight your customers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {storeStats.completedOrders} Completed
                </Badge>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <Clock className="h-3 w-3 mr-1" />
                  {storeStats.pendingOrders} Pending
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500">Orders from customers will appear here once they make purchases.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : order.status === 'pending' ? 'secondary' : 'destructive'}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order Details</p>
                          <p className="font-medium">Total: {formatCurrency(order.total)}</p>
                          <p className="text-sm text-muted-foreground">
                            Ordered: {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pickup: {new Date(order.pickupTime).toLocaleDateString()} at {new Date(order.pickupTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {order.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-fresh-50 to-green-50 border-fresh-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-fresh-800">
                      Welcome back, {backendUser?.name}! 👋
                    </h1>
                    <p className="text-fresh-600 mt-1">
                      Your store is performing well. Here's what's happening today.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-fresh-600">Today's Sales</div>
                    <div className="text-2xl font-bold text-fresh-800">
                      {formatCurrency(1250.50)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-l-4 border-fresh-200">
                      <Bell className={`h-4 w-4 mt-0.5 ${notification.urgent ? 'text-red-500' : 'text-gray-500'}`} />
                      <div className="flex-1">
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                      {notification.urgent && (
                        <Badge variant="destructive" className="animate-pulse">Urgent</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Plus className="h-8 w-8 text-fresh mx-auto mb-2" />
                  <h3 className="font-semibold">Add New Listing</h3>
                  <p className="text-sm text-gray-600">Quick sell expiring food</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">View Analytics</h3>
                  <p className="text-sm text-gray-600">Track your performance</p>
                </CardContent>
              </Card>
            </div>

            {/* Store Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((storeStats.totalRevenue / 1500) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Monthly Goal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        4.8⭐
                      </div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ChefHat className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {storeStats.totalOrders}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
