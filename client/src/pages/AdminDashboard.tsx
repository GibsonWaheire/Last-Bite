import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock admin data
  const adminStats = {
    totalUsers: 10247,
    totalStores: 523,
    totalListings: 1847,
    totalRevenue: 2456000, // KES
    wasteReduced: 15600, // kg
    activeListings: 1234,
    pendingApprovals: 23,
    reportedIssues: 7
  };

  const recentUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", joinDate: "2024-12-15", status: "active", purchases: 12 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", joinDate: "2024-12-14", status: "active", purchases: 8 },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", joinDate: "2024-12-13", status: "pending", purchases: 0 }
  ];

  const recentStores = [
    { id: "1", name: "Baker's Corner", owner: "Alice Johnson", joinDate: "2024-12-10", status: "active", listings: 15 },
    { id: "2", name: "Green Grocer", owner: "Mike Brown", joinDate: "2024-12-08", status: "active", listings: 22 },
    { id: "3", name: "Fresh Market", owner: "Sarah Davis", joinDate: "2024-12-05", status: "pending", listings: 0 }
  ];

  const pendingApprovals = [
    { id: "1", type: "Store", name: "Organic Foods Co.", submittedBy: "Tom Wilson", date: "2024-12-15" },
    { id: "2", type: "Listing", name: "Premium Meat Bundle", submittedBy: "Baker's Corner", date: "2024-12-14" },
    { id: "3", type: "Store", name: "Local Bakery", submittedBy: "Emma White", date: "2024-12-13" }
  ];

  const systemAlerts = [
    { id: "1", type: "warning", message: "High server load detected", time: "2 hours ago" },
    { id: "2", type: "info", message: "Weekly backup completed successfully", time: "1 day ago" },
    { id: "3", type: "error", message: "Payment gateway timeout reported", time: "3 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage platform operations and monitor system health
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-hero hover:shadow-glow">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="outline" className="text-orange-600 border-orange-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pending Approvals ({adminStats.pendingApprovals})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalStores}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(adminStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Platform commission
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Reduced</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.wasteReduced.toLocaleString()}kg</div>
              <p className="text-xs text-muted-foreground">
                Environmental impact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Activity className="h-5 w-5 mr-2" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      {alert.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Listings</span>
                      <span className="font-bold">{adminStats.activeListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-bold">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions Today</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="font-bold text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">New store registered:</span> Fresh Market
                      <span className="text-muted-foreground ml-2">2 hours ago</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Listing approved:</span> Organic Vegetables Bundle
                      <span className="text-muted-foreground ml-2">4 hours ago</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">User milestone:</span> 10,000th user registered
                      <span className="text-muted-foreground ml-2">1 day ago</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">System update:</span> Security patches applied
                      <span className="text-muted-foreground ml-2">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email} • Joined: {new Date(user.joinDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.purchases} purchases
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStores.map((store) => (
                    <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{store.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Owner: {store.owner} • Joined: {new Date(store.joinDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {store.listings} active listings
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                          {store.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{adminStats.totalListings}</div>
                      <p className="text-sm text-muted-foreground">Total Listings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{adminStats.activeListings}</div>
                      <p className="text-sm text-muted-foreground">Active Listings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{adminStats.pendingApprovals}</div>
                      <p className="text-sm text-muted-foreground">Pending Approval</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-muted-foreground">
                  Detailed listing management interface would be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{item.type}</Badge>
                          <h4 className="font-semibold">{item.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted by: {item.submittedBy} • {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
