import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Plus, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart,
  Settings,
  Bell,
  Eye,
  Trash2,
  Edit,
  LogOut,
  Target,
  Calendar,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { foodApi, purchaseApi, userApi } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  foodName: string;
  quantity: number;
  totalAmount: number;
  orderTime: string;
  pickupTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface FoodListing {
  id: number;
  name: string;
  price: number;
  stock: number;
  expiry_date: string;
  user_id: number;
}

const EnhancedStoreDashboard = () => {
  const { currentUser, userRole, backendUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('store');

  const [orders, setOrders] = useState<Order[]>([]);
  const [myFoods, setMyFoods] = useState<FoodListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    if (!currentUser || userRole !== 'store_owner') {
      navigate('/store-owner-landing');
      return;
    }

    fetchOrders();
    fetchMyFoods();
  }, [currentUser, userRole, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch orders, purchases, users, and foods
      const [purchases, users, foods] = await Promise.all([
        purchaseApi.getAllPurchases(),
        userApi.getAllUsers(),
        foodApi.getAllFoods()
      ]);
      
      // Filter orders for current store owner
      const ownerFoods = foods.filter(food => food.user_id === backendUser?.id);
      const ownerFoodIds = ownerFoods.map(food => food.id);
      
      const relatedPurchases = purchases.filter(purchase => 
        ownerFoodIds.includes(purchase.food_id)
      );

      // Transform purchases into orders with customer data
      const ordersWithCustomerData = relatedPurchases.map(purchase => {
        const food = foods.find(f => f.id === purchase.food_id);
        const customer = users.find(u => u.id === purchase.user_id);
        
        return {
          id: purchase.id,
          customerName: customer?.name || 'Unknown Customer',
          customerEmail: customer?.email || 'unknown@email.com',
          foodName: food?.name || 'Unknown Food',
          quantity: purchase.quantity_bought,
          totalAmount: (food?.price || 0) * purchase.quantity_bought,
          orderTime: purchase.purchase_date,
          pickupTime: 'ASAP', // Default pickup time
          status: 'pending' as const, // Default status
          notes: `Order placed for ${food?.name}`
        };
      });

      setOrders(ordersWithCustomerData);
      setNewOrdersCount(ordersWithCustomerData.filter(order => order.status === 'pending').length);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyFoods = async () => {
    try {
      const foods = await foodApi.getAllFoods();
      const ownerFoods = foods.filter(food => food.user_id === backendUser?.id);
      setMyFoods(ownerFoods);
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load food listings');
    }
  };

  const handleCompleteOrder = (orderId: number) => {
    // Simulate order completion
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' as const }
        : order
    ));
    setNewOrdersCount(prev => Math.max(0, prev - 1));
    toast.success('Order marked as completed');

    // Update stock
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'pending') {
      setMyFoods(prev => prev.map(food => {
        if (food.name === order.foodName) {
          return {
            ...food,
            stock: Math.max(0, food.stock - order.quantity)
          };
        }
        return food;
      }));
    }
  };

  const handleCancelOrder = (orderId: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const }
        : order
    ));
    toast.success('Order cancelled');
  };

  const storeStats = {
    totalRevenue: orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed').length,
    foodListings: myFoods.length,
    availableStock: myFoods.reduce((sum, food) => sum + food.stock, 0),
    avgRating: 4.7, // Mock data
    monthlyGoal: 50000 // Mock data
  };

  const handleLogout = async () => {
    try {
      await navigate('/store-owner-landing');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="h-8 w-8 animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading your store dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900">
      {/* Header */}
      <header className="border-b bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <Store className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Store Dashboard</h1>
                <p className="text-gray-300">
                  Welcome back, {backendUser?.name || 'Store Owner'}
                </p>
              </div>
              {newOrdersCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Bell className="h-3 w-3 mr-1" />
                  {newOrdersCount} New {newOrdersCount === 1 ? 'Order' : 'Orders'}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/create-listing')}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Food Listing
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  📊 Today's Sales: {formatCurrency(storeStats.totalRevenue)}
                </h2>
                <p className="text-green-300">
                  You're doing great! Keep up the excellent work reducing food waste.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{storeStats.pendingOrders}</div>
                <div className="text-sm text-green-300">Pending Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-white/5 border border-white/20">
            <TabsTrigger value="store" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Store className="h-4 w-4 mr-2" />
              Store Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders ({storeStats.pendingOrders})
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Inventory ({storeStats.foodListings})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Store Overview */}
          <TabsContent value="store" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(storeStats.totalRevenue)}
                  </div>
                  <div className="text-xs text-green-400">+12% this month</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Orders Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{storeStats.totalOrders}</div>
                  <div className="text-xs text-purple-400">{storeStats.pendingOrders} pending</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Food Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{storeStats.foodListings}</div>
                  <div className="text-xs text-orange-400">{storeStats.availableStock} in stock</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Monthly Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {Math.round((storeStats.totalRevenue / storeStats.monthlyGoal) * 100)}%
                  </div>
                  <div className="text-xs text-blue-400">{formatCurrency(storeStats.monthlyGoal)} target</div>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity Feed */}
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newOrdersCount > 0 && (
                    <Alert className="border-yellow-500 bg-yellow-500/10">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-300">
                        <strong>Attention:</strong> You have {newOrdersCount} new order{newOrdersCount !== 1 ? 's' : ''} waiting for confirmation!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Recent Activity</h4>
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ShoppingCart className="h-4 w-4 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Order #{order.id}</p>
                            <p className="text-gray-400 text-sm">
                              {order.foodName} • {order.quantity}x • {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={order.status === 'pending' ? 'default' : 'secondary'}
                          className={
                            order.status === 'pending' ? 'animate-pulse bg-yellow-500' : ''
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Performance Summary */}
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Store Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">4.7★</div>
                    <div className="text-sm text-gray-300">Customer Rating</div>
                    <div className="text-xs text-gray-400">Based on 127 reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">94%</div>
                    <div className="text-sm text-gray-300">Order Completion Rate</div>
                    <div className="text-xs text-gray-400">Last 30 days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">2.4h</div>
                    <div className="text-sm text-gray-300">Avg Response Time</div>
                    <div className="text-xs text-gray-400">To new orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Order Management</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage customer orders and track fulfillment status
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {storeStats.completedOrders} Completed • {storeStats.pendingOrders} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="bg-white/5 border border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                            <p className="text-gray-300">Customer: {order.customerName}</p>
                            <p className="text-sm text-gray-400">{order.customerEmail}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={order.status === 'pending' ? 'default' : 'secondary'}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-lg font-bold text-green-400">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-orange-400" />
                              <span className="text-gray-300">Food Item:</span>
                              <span className="text-white font-medium">{order.foodName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-purple-400" />
                              <span className="text-gray-300">Quantity:</span>
                              <span className="text-white font-medium">{order.quantity}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-400" />
                              <span className="text-gray-300">Order Time:</span>
                              <span className="text-white font-medium">
                                {new Date(order.orderTime).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-green-400" />
                              <span className="text-gray-300">Pickup:</span>
                              <span className="text-white font-medium">{order.pickupTime}</span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                            <p className="text-sm text-blue-300">
                              <strong>Customer Note:</strong> {order.notes}
                            </p>
                          </div>
                        )}

                        {order.status === 'pending' && (
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleCompleteOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleCancelOrder(order.id)}
                              className="border-red-400 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Order
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-300 text-lg">No orders yet</p>
                      <p className="text-gray-400">Orders will appear here when customers make purchases</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Food Inventory</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage your food listings and track stock levels
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate('/create-listing')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Listing
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myFoods.map((food) => (
                    <Card key={food.id} className="bg-white/5 border border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{food.name}</h3>
                          <Badge variant={food.stock > 0 ? 'default' : 'destructive'}>
                            {food.stock > 0 ? `${food.stock} in stock` : 'Out of stock'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Price:</span>
                            <span className="text-white font-medium">{formatCurrency(food.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Stock:</span>
                            <span className="text-white font-medium">{food.stock}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Expiry:</span>
                            <span className="text-white font-medium">
                              {food.expiry_date ? new Date(food.expiry_date).toLocaleDateString() : 'No expiry'}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-red-400 border-red-400 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {myFoods.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-300 text-lg">No food listings yet</p>
                      <p className="text-gray-400 mb-4">Add your first food listing to start attracting customers</p>
                      <Button
                        onClick={() => navigate('/create-listing')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Listing
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Today</span>
                      <span className="text-white font-medium">{formatCurrency(storeStats.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-white font-medium">{formatCurrency(storeStats.totalRevenue * 7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">This Month</span>
                      <span className="text-white font-medium">{formatCurrency(storeStats.totalRevenue * 30)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((storeStats.totalRevenue / storeStats.monthlyGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      Monthly Goal: {formatCurrency(storeStats.monthlyGoal)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Order Completion Rate</span>
                      <span className="text-green-400 font-medium">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Customer Satisfaction</span>
                      <span className="text-blue-400 font-medium">4.7★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg Response Time</span>
                      <span className="text-purple-400 font-medium">2.4 hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Food Waste Reduction</span>
                      <span className="text-orange-400 font-medium">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Growth Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-500/10">
                    <Target className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <strong>Great job!</strong> Your food waste reduction efforts are making a real impact. 
                      Continue optimizing your inventory to maximize both environmental and financial benefits.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">127</div>
                      <div className="text-sm text-gray-300">Happy Customers</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
                      <div className="text-sm text-gray-300">Waste Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-1">€2,340</div>
                      <div className="text-sm text-gray-300">Saved This Month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedStoreDashboard;
