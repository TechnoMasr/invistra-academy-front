import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoadingPage from "../Loading/LoadingPage";

const AuthGuard = () => {
  const { isAuthenticated, isEmailVerified } = useSelector((s) => s.auth);

  if (!isAuthenticated) return <Outlet />;

  // لو مسجل بس إيميله مش متفعل، يروح OTP
  if (!isEmailVerified) return <Navigate to="/verify-email" replace />;

  // لو مسجل وإيميله متفعل، يروح الـ home
  return <Navigate to="/" replace />;
};

export default AuthGuard;
