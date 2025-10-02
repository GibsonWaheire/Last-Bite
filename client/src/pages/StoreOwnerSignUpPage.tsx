import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Mail, Lock, Eye, EyeOff, Store } from "lucide-react";
import { toast } from "sonner";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signUpValidationSchema, initialSignUpValues } from "@/lib/validations";

const StoreOwnerSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  // Redirect authenticated users away from the sign-up page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is a store owner
        const email = user.email || '';
        if (email.includes('@store.')) {
          navigate("/store-dashboard");
        } else {
          // User is not a store owner, show error and sign out
          toast.error("This email is not registered as a store owner");
          auth.signOut();
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

  const handleSignUp = async (values: typeof initialSignUpValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      // Check if email is for store owners
      if (!values.email.includes('@store.')) {
        toast.error("Please use a store owner email address (must contain @store.)");
        return;
      }

      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Store owner account created successfully! Welcome to Last Bite Rescue!");
      // The onAuthStateChanged listener will handle the redirection
    } catch (error: unknown) {
      console.error("Sign-up error:", error);
      let errorMessage = "An unexpected error occurred during registration.";

      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = "Please enter a valid email address.";
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = "Password is too weak. Please choose a stronger password.";
        } else if (firebaseError.code === 'auth/operation-not-allowed') {
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
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
          <div className="flex justify-center mb-2">
            <Store className="h-8 w-8 text-fresh" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Store Owner Sign Up</CardTitle>
          <CardDescription>
            Create your store owner account to start selling on Last Bite Rescue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialSignUpValues}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSignUp}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Store Owner Name</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-9"
                      value={values.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("name", e.target.value)
                      }
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Store Owner Email</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="owner@store.example.com"
                      className="pl-9"
                      value={values.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("email", e.target.value)
                      }
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                  <p className="text-xs text-muted-foreground">
                    Use a store owner email (must contain @store.)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-9 pr-9"
                      value={values.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("confirmPassword", e.target.value)
                      }
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Creating Account..." : "Sign Up as Store Owner"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/store-owner-signin" className="text-sm text-fresh hover:underline">
            Already have a store owner account? Sign in
          </Link>
          <Link to="/signup" className="text-xs text-muted-foreground hover:underline">
            Are you a customer? Customer Sign Up
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Go back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoreOwnerSignUpPage;
