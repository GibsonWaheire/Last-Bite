import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';

const adminLoginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  secretKey: Yup.string()
    .min(8, 'Secret key must be at least 8 characters')
    .required('Secret key is required'),
});

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      secretKey: '',
    },
    validationSchema: adminLoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await adminApi.adminLogin(values.email, values.secretKey);
        
        // Store admin session info
        localStorage.setItem('admin_token', result.admin_token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));
        
        toast.success(`Welcome, ${result.user.name}! Admin access granted.`);
        navigate('/admin-dashboard');
        
      } catch (error: any) {
        const errorMessage = error.message || 'Admin authentication failed';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Admin login error:', error);
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-600/20 rounded-full">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-300">
              Secure administrative login
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 ${
                    formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-400">{formik.errors.email}</p>
                )}
              </div>

              {/* Secret Key Field */}
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="text-gray-300">
                  Secret Key
                </Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="Enter admin secret key"
                    value={formik.values.secretKey}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 pr-10 ${
                      formik.touched.secretKey && formik.errors.secretKey ? 'border-red-500' : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formik.touched.secretKey && formik.errors.secretKey && (
                  <p className="text-sm text-red-400">{formik.errors.secretKey}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
             .

For admin assistance, contact support.

For admin assistance, contact support.

              <p className="text-sm text-gray-300 mb-2">
                <strong>Admin Access:</strong>
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Secure access to administrative functions</li>
                <li>• Full system management capabilities</li>
                <li>• Real-time system monitoring</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
