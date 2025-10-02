import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signUpValidationSchema, initialSignUpValues } from "@/lib/validations";
import { userApi } from "@/lib/api";

const SignUpPage = () => {
  const [showPasswordCustomer, setShowPasswordCustomer] = useState(false);
  const [showConfirmPasswordCustomer, setShowConfirmPasswordCustomer] = useState(false);
  const [showPasswordStore, setShowPasswordStore] = useState(false);
  const [showConfirmPasswordStore, setShowConfirmPasswordStore] = useState(false);
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

  // No auto-redirects here; each submit will route accordingly

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

  const handleCustomerSignUp = async (
    values: typeof initialSignUpValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await userApi.createUser({
        name: values.name,
        email: values.email,
        role: 'customer',
        firebase_uid: cred.user.uid,
      });
      toast.success("Account created successfully! Welcome!");
      navigate("/user-dashboard");
    } catch (error: unknown) {
      console.error("Customer sign-up error:", error);
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

  const handleStoreOwnerSignUp = async (
    values: typeof initialSignUpValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await userApi.createUser({
        name: values.name,
        email: values.email,
        role: 'store_owner',
        firebase_uid: cred.user.uid,
      });
      toast.success("Store owner account created successfully! Welcome!");
      navigate("/store-dashboard");
    } catch (error: unknown) {
      console.error("Store owner sign-up error:", error);
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
          <CardTitle className="text-3xl font-bold tracking-tight">Sign Up</CardTitle>
          <CardDescription>Use the toggle to choose your role</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="store-owner">Store Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="mt-4">
              <Formik initialValues={initialSignUpValues} validationSchema={signUpValidationSchema} onSubmit={handleCustomerSignUp}>
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
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
                          type={showPasswordCustomer ? "text" : "password"}
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
                          onClick={() => setShowPasswordCustomer(!showPasswordCustomer)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                          {showPasswordCustomer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                          type={showConfirmPasswordCustomer ? "text" : "password"}
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
                          onClick={() => setShowConfirmPasswordCustomer(!showConfirmPasswordCustomer)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                          {showConfirmPasswordCustomer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>

                    <Button type="submit" className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" disabled={isSubmitting || loading}>
                      {loading ? "Creating Account..." : "Sign Up as Customer"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>

            <TabsContent value="store-owner" className="mt-4">
              <Formik initialValues={initialSignUpValues} validationSchema={signUpValidationSchema} onSubmit={handleStoreOwnerSignUp}>
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="store-name">Store / Full Name</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="store-name"
                          name="name"
                          type="text"
                          placeholder="Your Store or Full Name"
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
                      <Label htmlFor="store-email">Email</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="store-email"
                          name="email"
                          type="email"
                          placeholder="owner@example.com"
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
                      <Label htmlFor="store-password">Password</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="store-password"
                          name="password"
                          type={showPasswordStore ? "text" : "password"}
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
                          onClick={() => setShowPasswordStore(!showPasswordStore)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswordStore ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="store-confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="store-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPasswordStore ? "text" : "password"}
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
                          onClick={() => setShowConfirmPasswordStore(!showConfirmPasswordStore)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPasswordStore ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300" disabled={isSubmitting || loading}>
                      {loading ? "Creating Account..." : "Sign Up as Store Owner"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/signin" className="text-sm text-fresh hover:underline">
            Already have an account? Sign in
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Go back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
