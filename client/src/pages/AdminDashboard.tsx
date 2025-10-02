import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle,
  Trash2, 
  Eye, 
  RefreshCw,
  LogOut,
  Settings,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi, User } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    const adminUserData = localStorage.getItem('admin_user');
    
    if (!adminToken || !adminUserData) {
      toast.error('Access denied. Please login as admin.');
      navigate('/admin-login');
      return;
    }

    try {
      const user = JSON.parse(adminUserData);
      setAdminUser(user);
      fetchDashboardData();
    } catch (error) {
      console.error('Error parsing admin user:', error);
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, foodsData, purchasesData] = await Promise.all([
        adminApi.getSystemStats(),
        adminApi.getAllUsers(),
        adminApi.getAllFoods(),
        adminApi.getAllPurchases()
      ]);

      setStats(statsData);
      setUsers(usersData);
      setFoods(foodsData);
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  const handleDeleteFood = async (foodId: number, foodName: string) => {
    if (!confirm(`Are you sure you want to delete "${foodName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteFood(foodId);
      toast.success(`Food listing "${foodName}" deleted successfully`);
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food listing');
    }
  };

  const handleToggleUserStatus = async (userId: number, userName: string) => {
    try {
      await adminApi.toggleUserStatus(userId);
      toast.success(`User status updated for ${userName}`);
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'store_owner': return 'secondary';
      case 'customer': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
      <header className="border-b bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-300">
                  Welcome back, {adminUser?.name}
          </p>
        </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab('overview')}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-white/5 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="foods" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Foods ({foods.length})
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Purchases ({purchases.length})
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.users?.total || 0}</div>
                  <p className="text-xs text-green-400">
                    {stats?.users?.customers || 0} customers, {stats?.users?.store_owners || 0} stores
              </p>
            </CardContent>
          </Card>

              <Card className="bg-white/5 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Food Listings</CardTitle>
                  <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.foods?.total || 0}</div>
                  <p className="text-xs text-blue-400">
                    Active listings
              </p>
            </CardContent>
          </Card>

              <Card className="bg-white/5 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Purchases</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.purchases?.total || 0}</div>
                  <p className="text-xs text-purple-400">
                    {stats?.purchases?.recent_week || 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Admin Panel</CardTitle>
                  <Shield className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.users?.admins || 0}</div>
                  <p className="text-xs text-red-400">
                    Admin users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.slice(0, 5).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-white font-medium">New Purchase #{purchase.id}</p>
                          <p className="text-gray-400 text-sm">
                            Quantity: {purchase.quantity_bought} • User ID: {purchase.user_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">{purchase.purchase_date?.slice(0, 10) || 'Unknown'}</p>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{user.name[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getRoleColor(user.role)} className="capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.name)}
                          className="border-red-400 text-red-400 hover:bg-red-500/10"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Foods Tab */}
          <TabsContent value="foods" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Food Listing Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage all food listings across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {foods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{food.name}</p>
                          <p className="text-gray-400 text-sm">
                            Price: {formatCurrency(food.price)} • Stock: {food.stock} • Owner ID: {food.user_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-orange-400 border-orange-400">
                          {food.stock > 0 ? 'Available' : 'Out of Stock'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFood(food.id, food.name)}
                          className="border-red-400 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Purchase History</CardTitle>
                <CardDescription className="text-gray-300">
                  View all transactions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Purchase #{purchase.id}</p>
                          <p className="text-gray-400 text-sm">
                            User ID: {purchase.user_id} • Food ID: {purchase.food_id} • Qty: {purchase.quantity_bought}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Completed
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">{purchase.purchase_date?.slice(0, 10) || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white/5 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Information</CardTitle>
                <CardDescription className="text-gray-300">
                  Platform health and administration tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Database Health</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Records:</span>
                        <span className="text-white">{(stats?.users?.total || 0) + (stats?.foods?.total || 0) + (stats?.purchases?.total || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Users:</span>
                        <span className="text-green-400">{stats?.users?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Food Listings:</span>
                        <span className="text-orange-400">{stats?.foods?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Purchases:</span>
                        <span className="text-blue-400">{stats?.purchases?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                    <div className="space-y-3">
                      <Alert className="border-blue-500 bg-blue-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-blue-400">
                          Use CLI for advanced operations: <code className="text-blue-300">python cli.py stats</code>
                        </AlertDescription>
                      </Alert>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-400 text-red-400 hover:bg-red-500/10"
                        onClick={() => navigate('/admin-login')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Fresh Login Session
                      </Button>
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

export default AdminDashboard;