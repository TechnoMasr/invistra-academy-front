import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoadingPage from "../Loading/LoadingPage";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <LoadingPage />;

  // لو مفيش user → رجّعه لصفحة login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
