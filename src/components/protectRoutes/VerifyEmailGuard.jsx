import { useSelector } from "react-redux";
import LoadingPage from "../Loading/LoadingPage";
import { Navigate } from "react-router";

const VerifyEmailGuard = ({ children }) => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <LoadingPage />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.is_verified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default VerifyEmailGuard;
