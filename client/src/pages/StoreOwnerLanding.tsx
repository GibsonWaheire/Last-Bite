import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Store, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  BarChart,
  Clock,
  Target,
  TrendingDown,
  Leaf,
  DollarSign,
  MapPin,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const storeOwnerSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const StoreOwnerLanding = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
    validationSchema: storeOwnerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      
      try {
        if (activeTab === 'signin') {
          // Handle store owner sign-in
          toast.success('Store owner sign-in successful! Redirecting to dashboard...');
          navigate('/store-dashboard');
        } else {
          // Handle store owner sign-up
          toast.success('Store owner sign-up successful! Redirecting to dashboard...');
          navigate('/store-dashboard');
        }
      } catch (error) {
        toast.error('Authentication failed');
        console.error('Store owner auth error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const storeFeatures = [
    {
      icon: Package,
      title: "Smart Inventory Management",
      description: "Automatically track expiry dates and price reductions. Reduce waste while maximizing revenue.",
      color: "text-fresh"
    },
    {
      icon: Users,
      title: "Instant Customer Reach",
      description: "Connect with thousands of local customers looking for discounted food items.",
      color: "text-warm"
    },
    {
      icon: BarChart,
      title: "Revenue Analytics",
      description: "Track sales performance, popular items, and profit margins with detailed analytics.",
      color: "text-golden"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Set availability windows and let customers pick up when convenient.",
      color: "text-earth"
    }
  ];

  const stats = [
    { 
      label: "Store Owners", 
      value: "500+", 
      icon: Store,
      color: "text-fresh"
    },
    { 
      label: "Monthly Revenue", 
      value: "€12K+", 
      icon: DollarSign,
      color: "text-warm"
    },
    { 
      label: "Food Saved", 
      value: "15K+ meals", 
      icon: Leaf,
      color: "text-golden"
    },
    { 
      label: "Satisfaction Rate", 
      value: "98%", 
      icon: TrendingUp,
      color: "text-earth"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 mb-6">
              <Store className="h-6 w-6 text-fresh" />
              <span className="text-fresh font-semibold">For Store Owners</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Turn Food Waste Into
              <span className="bg-gradient-hero bg-clip-text text-transparent block">
                Extra Revenue
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Join hundreds of store owners who are reducing food waste while increasing profits. 
              List surplus food at discounted prices and connect with local customers instantly.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`flex items-center justify-center mb-2 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
                <Link to="#signup">
                  Start Listing Food
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-fresh text-fresh hover:bg-fresh hover:text-white"
                asChild
              >
                <Link to="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Everything You Need to Grow Your Business</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides simple tools for store owners to manage inventory, 
              reduce waste, and connect with customers effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeFeatures.map((feature) => (
              <Card key={feature.title} className="relative overflow-hidden group hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className={`p-3 rounded-lg bg-gradient-accent w-fit ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Store Owners Choose Last Bite</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-fresh/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-fresh" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Zero Waste Goals</h3>
                    <p className="text-muted-foreground">Reduce food waste by 80% while generating additional revenue from surplus inventory.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-warm/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-warm" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Revenue Growth</h3>
                    <p className="text-muted-foreground">Increase average revenue by 15% through optimized pricing and reduced waste.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-golden/10 rounded-lg">
                    <Users className="h-5 w-5 text-golden" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Customer Acquisition</h3>
                    <p className="text-muted-foreground">Attract new budget-conscious customers and boost store foot traffic.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-earth/10 rounded-lg">
                    <

Clock className="h-5 w-5 text-earth" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Easy Management</h3>
                    <p className="text-muted-foreground">Simple dashboard to manage listings, orders, and track performance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Card */}
            <Card id="signup" className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  <Store className="h-8 w-8 mx-auto mb-2 text-fresh" />
                  Join as a Store Owner
                </CardTitle>
                <CardDescription className="text-center">
                  Start listing your food items and connect with customers
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Tab Navigation */}
                <div className="flex mb-6 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'signin'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'signup'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your-store@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Access Store Dashboard
                    </Button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Store Owner Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Store Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="owner@mystore.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Create Your Store
                    </Button>
                  </form>
                )}

                {/* Benefits */}
                <Alert className="mt-6 border-fresh bg-fresh/10">
                  <CheckCircle className="h-4 w-4 text-fresh" />
                  <AlertDescription className="text-fresh-foreground">
                    <strong>Store Owner Benefits:</strong> No setup fees, keep 100% of sales revenue, 
                    real-time notifications, and advanced analytics.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Store Owners Love Last Bite</h2>
            <p className="text-xl text-muted-foreground">
              Hear from store owners who have transformed their business with Last Bite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Santos</h4>
                  <p className="text-sm text-muted-foreground">Fresh Market</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "We've reduced food waste by 75% and increased revenue by 20%. 
                Last Bite helped us reach new customers while doing something good for the environment."
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-golden">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ahmed Hassan</h4>
                  <p className="text-sm text-muted-foreground">Corner Bakery</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The platform is so easy to use. Within weeks, we were selling out 
                of day-old bread instead of throwing it away. Our customers love the deals!"
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-golden">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sofia Chen</h4>
                  <p className="text-sm text-muted-foreground">Green Supermarket</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "We've built a community of loyal customers through Last Bite. 
                The analytics help us optimize our stocking and reduce waste significantly."
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-golden">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Reduce Waste & Increase Profits?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join over 500 store owners who are making a difference while growing their business. 
              Start listing your food items today and connect with customers tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
                asChild
              >
                <Link to="#signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-warm text-warm hover:bg-warm hover:text-white"
              >
                <Package className="mr-2 h-5 w-5" />
                View Sample Listings
              </Button>
            </div>

            <Alert className="mt-8 border-golden bg-golden/10">
              <Clock className="h-4 w-4 text-golden" />
              <AlertDescription className="text-golden-foreground">
                <strong>Instant Setup:</strong> Create our store profile in under 5 minutes. 
                No contracts, no monthly fees - just start earning from your surplus food today.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StoreOwnerLanding;