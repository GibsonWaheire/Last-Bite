import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirect component for store owner sign-up
 * Preserves deep linking while using unified sign-up page
 */
const StoreOwnerSignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified sign-up page with store owner role preselected
    navigate("/signup?role=store", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fresh"></div>
    </div>
  );
};

export default StoreOwnerSignUpPage;