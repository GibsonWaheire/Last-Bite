import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signInValidationSchema, initialSignInValues } from "@/lib/validations";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  // Redirect authenticated users away from the sign-in page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is a customer (not store owner or admin)
        const email = user.email || '';
        if (email.includes('@store.') || email.includes('@admin.')) {
          // User is not a customer, show error and sign out
          toast.error("This email is not registered as a customer");
          auth.signOut();
        } else {
          // User is a customer, redirect to dashboard
          navigate("/user-dashboard");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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

  const handleSignIn = async (values: typeof initialSignInValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      // Check if email is for customers (not store owners or admins)
      if (values.email.includes('@store.') || values.email.includes('@admin.')) {
        toast.error("Please use your customer email address");
        return;
      }

      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Signed in successfully as customer!");
      // The onAuthStateChanged listener will handle the redirection
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
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
      <Card ref={cardRef} className="w-full max-w-sm border-2 border-fresh-200 shadow-lg animate-in fade-in zoom-in-50 duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Customer Sign In</CardTitle>
          <CardDescription>
            Sign in to access your customer dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialSignInValues}
            validationSchema={signInValidationSchema}
            onSubmit={handleSignIn}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9"
                      value={values.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFieldValue("email", e.target.value)
                      }
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-9 pr-9"
                      value={values.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFieldValue("password", e.target.value)
                      }
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Signing in..." : "Sign In as Customer"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/signup" className="text-sm text-fresh hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link to="/store-owner-signin" className="text-xs text-muted-foreground hover:underline">
            Are you a store owner? Store Owner Sign In
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
