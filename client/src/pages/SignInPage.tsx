import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signInValidationSchema, initialSignInValues } from "@/lib/validations";
import { userApi } from "@/lib/api";

const SignInPage = () => {
  const [showPasswordCustomer, setShowPasswordCustomer] = useState(false);
  const [showPasswordStore, setShowPasswordStore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

  // Set initial tab based on URL parameter
  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'store' || role === 'store_owner') {
      setActiveTab("store-owner");
    }
  }, [searchParams]);

  // No auto-redirects; submission handlers route by role

  // Handle click outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Click outside the form - navigate back to home
        navigate('/');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleCustomerSignIn = async (values: typeof initialSignInValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const backendUser = await userApi.syncFirebaseUser(cred.user.uid, values.email, cred.user.displayName || values.email.split('@')[0]);
      
      if (backendUser.role !== 'customer') {
        toast.error("This email is not registered as a customer. Please use the 'Store Owner' tab or a customer email.");
        await auth.signOut(); // Sign out if role mismatch
        return;
      }

      toast.success("Signed in successfully as customer!");
      navigate("/user-dashboard");
    } catch (error: unknown) {
      console.error("Customer sign-in error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (firebaseError.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (firebaseError.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (firebaseError.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (firebaseError.code) {
          errorMessage = `Error: ${firebaseError.code.split('/')[1].replace(/-/g, ' ')}`;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleStoreOwnerSignIn = async (values: typeof initialSignInValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const backendUser = await userApi.syncFirebaseUser(cred.user.uid, values.email, cred.user.displayName || values.email.split('@')[0]);
      
      if (backendUser.role !== 'store_owner') {
        toast.error("This email is not registered as a store owner. Please use the 'Customer' tab or a store owner email.");
        await auth.signOut(); // Sign out if role mismatch
        return;
      }

      toast.success("Signed in successfully as store owner!");
      navigate("/store-dashboard");
    } catch (error: unknown) {
      console.error("Store owner sign-in error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (firebaseError.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (firebaseError.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (firebaseError.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (firebaseError.code) {
          errorMessage = `Error: ${firebaseError.code.split('/')[1].replace(/-/g, ' ')}`;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card ref={cardRef} className="w-full max-w-md border-2 border-fresh-200 shadow-lg animate-in fade-in zoom-in-50 duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Sign In</CardTitle>
          <CardDescription>Use the toggle to choose your role</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="store-owner">Store Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="mt-4">
              <Formik initialValues={initialSignInValues} validationSchema={signInValidationSchema} onSubmit={handleCustomerSignIn}>
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Field as={Input} id="email" name="email" type="email" placeholder="name@example.com" className="pl-9" value={values.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("email", e.target.value)} />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Field as={Input} id="password" name="password" type={showPasswordCustomer ? "text" : "password"} placeholder="Enter your password" className="pl-9 pr-9" value={values.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("password", e.target.value)} />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <button type="button" onClick={() => setShowPasswordCustomer(!showPasswordCustomer)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswordCustomer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" disabled={isSubmitting || loading}>
                      {loading ? "Signing in..." : "Sign In as Customer"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>

            <TabsContent value="store-owner" className="mt-4">
              <Formik initialValues={initialSignInValues} validationSchema={signInValidationSchema} onSubmit={handleStoreOwnerSignIn}>
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="store-email">Email</Label>
                      <div className="relative">
                        <Field as={Input} id="store-email" name="email" type="email" placeholder="owner@example.com" className="pl-9" value={values.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("email", e.target.value)} />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="store-password">Password</Label>
                      <div className="relative">
                        <Field as={Input} id="store-password" name="password" type={showPasswordStore ? "text" : "password"} placeholder="Enter your password" className="pl-9 pr-9" value={values.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("password", e.target.value)} />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <button type="button" onClick={() => setShowPasswordStore(!showPasswordStore)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswordStore ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" disabled={isSubmitting || loading}>
                      {loading ? "Signing in..." : "Sign In as Store Owner"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/signup" className="text-sm text-fresh hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Go back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
