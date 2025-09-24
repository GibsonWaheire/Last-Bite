import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  Heart, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  MapPin,
  Star,
  Award,
  Leaf,
  Clock,
  User,
  Home,
  List,
  Activity,
  Menu,
  X,
  Settings,
  Gift
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";
import PurchaseHistoryCard from "@/components/PurchaseHistoryCard";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import breadImage from "@/assets/bread.jpg";
import vegetablesImage from "@/assets/vegetables.jpg";
import dairyImage from "@/assets/dairy.jpg";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state: cartState } = useCart();

  // Calculate user stats from cart data
  const userStats = {
    totalPurchases: cartState.items.length,
    totalSaved: cartState.items.reduce((sum, item) => {
      const savings = (item.originalPrice - item.discountedPrice) * item.quantity;
      return sum + savings;
    }, 0),
    wasteReduced: cartState.items.reduce((sum, item) => sum + (item.quantity * 0.5), 0), // Estimate 0.5kg per item
    favoriteStores: new Set(cartState.items.map(item => item.store)).size,
    memberSince: "2024-01-15"
  };

  // Convert cart items to purchase history format
  const recentPurchases = cartState.items.map((item, index) => ({
    id: `purchase-${item.id}`,
    foodName: item.name,
    store: item.store,
    quantity: item.quantity,
    price: item.discountedPrice * item.quantity,
    purchaseDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Simulate different purchase dates
    status: "completed" as const,
    image: item.image
  }));

  // Get unique stores from cart
  const favoriteStores = Array.from(new Set(cartState.items.map(item => item.store))).map(storeName => {
    const storeItems = cartState.items.filter(item => item.store === storeName);
    const purchases = storeItems.reduce((sum, item) => sum + item.quantity, 0);
    const savings = storeItems.reduce((sum, item) => {
      const itemSavings = (item.originalPrice - item.discountedPrice) * item.quantity;
      return sum + itemSavings;
    }, 0);
    
    return {
      name: storeName,
      purchases,
      savings
    };
  });

  const achievements = [
    { 
      title: "First Rescue", 
      description: "Made your first food rescue purchase", 
      earned: cartState.items.length > 0,
      icon: Heart
    },
    { 
      title: "Waste Warrior", 
      description: "Saved 10kg of food from waste", 
      earned: userStats.wasteReduced >= 10,
      icon: Leaf
    },
    { 
      title: "Regular Rescuer", 
      description: "Made 20+ purchases", 
      earned: cartState.items.length >= 20,
      icon: Award
    },
    { 
      title: "Community Hero", 
      description: "Saved KES 10,000+ on groceries", 
      earned: userStats.totalSaved >= 10000,
      icon: Star
    }
  ];

  // Functional handlers
  const handleViewProfile = () => {
    toast.info("Profile settings would open here");
    setActiveTab("settings");
  };

  const handleShareAchievement = (achievement: string) => {
    toast.success(`Shared achievement: ${achievement}`);
  };

  const handleViewPurchaseDetails = (purchaseId: string) => {
    toast.success(`Viewing purchase details for ${purchaseId}`);
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
              <User className="h-6 w-6 text-fresh" />
              <span className="text-lg font-semibold">User Dashboard</span>
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
              variant={activeTab === "purchases" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("purchases")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              My Purchases
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("favorites")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <Button
              variant={activeTab === "achievements" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("achievements")}
            >
              <Award className="h-4 w-4 mr-2" />
              Achievements
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
              <Link to="/listings">
                <Gift className="h-4 w-4 mr-2" />
                Browse Deals
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
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome, Food Rescuer!</h1>
              <p className="text-lg text-muted-foreground">
                Your personal dashboard to track your impact and purchases.
              </p>
            </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-gradient-hero hover:shadow-glow">
              <Link to="/listings">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Food Deals
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/purchases">
                <Package className="h-4 w-4 mr-2" />
                View All Purchases
              </Link>
            </Button>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalPurchases}</div>
              <p className="text-xs text-muted-foreground">
                Food items rescued
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(userStats.totalSaved)}</div>
              <p className="text-xs text-muted-foreground">
                On grocery bills
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Reduced</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.wasteReduced}kg</div>
              <p className="text-xs text-muted-foreground">
                Food saved from waste
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Stores</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.favoriteStores}</div>
              <p className="text-xs text-muted-foreground">
                Partner stores visited
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartState.items.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start shopping to see your food rescue activity here!
                      </p>
                      <Button asChild>
                        <Link to="/listings">
                          Browse Food Deals
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentPurchases.slice(0, 3).map((purchase) => (
                        <div key={purchase.id} className="flex items-center space-x-3">
                          <img 
                            src={purchase.image} 
                            alt={purchase.foodName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{purchase.foodName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {purchase.store} • {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatCurrency(purchase.price)}</p>
                            <Badge variant="default" className="text-xs">
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Impact Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-sm">CO2 Reduced</span>
                      </div>
                      <span className="font-bold">23.4kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Member Since</span>
                      </div>
                      <span className="font-bold">
                        {new Date(userStats.memberSince).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Rescue Score</span>
                      </div>
                      <span className="font-bold">850 pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {activeTab === "purchases" && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                {cartState.items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your food rescue purchases will appear here once you start shopping.
                    </p>
                    <Button asChild>
                      <Link to="/listings">
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {recentPurchases.map((purchase) => (
                        <PurchaseHistoryCard key={purchase.id} {...purchase} />
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline" asChild>
                        <Link to="/purchases">
                          View All Purchases
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
        )}

        {activeTab === "favorites" && (
            <Card>
              <CardHeader>
                <CardTitle>Favorite Stores</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteStores.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorite stores yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your favorite stores will appear here as you shop from different locations.
                    </p>
                    <Button asChild>
                      <Link to="/listings">
                        Discover Stores
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoriteStores.map((store, index) => (
                      <div key={store.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{store.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {store.purchases} purchases
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-fresh">{formatCurrency(store.savings)}</p>
                          <p className="text-xs text-muted-foreground">saved</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
        )}

        {activeTab === "achievements" && (
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-lg ${
                          achievement.earned 
                            ? 'bg-gradient-card border-green-200' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.earned 
                              ? 'bg-gradient-hero text-white' 
                              : 'bg-gray-300 text-gray-500'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        {achievement.earned && (
                          <Badge className="mt-2 bg-green-100 text-green-800">
                            Earned
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings panel coming soon!</p>
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

export default UserDashboard;
