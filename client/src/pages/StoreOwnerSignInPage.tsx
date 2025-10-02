import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirect component for store owner sign-in
 * Preserves deep linking while using unified sign-in page
 */
const StoreOwnerSignInPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified sign-in page with store owner role preselected
    navigate("/signin?role=store", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fresh"></div>
    </div>
  );
};

export default StoreOwnerSignInPage;