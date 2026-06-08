import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoadingPage from "../Loading/LoadingPage";

const AuthGuard = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <LoadingPage />;

  // لو user موجود → رجّعه للهوم
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
