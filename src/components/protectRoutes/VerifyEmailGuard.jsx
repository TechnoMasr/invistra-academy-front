import { useSelector } from "react-redux";
import LoadingPage from "../Loading/LoadingPage";
import { Navigate } from "react-router";

const VerifyEmailGuard = ({ children }) => {
  const { isAuthenticated, isEmailVerified } = useSelector((s) => s.auth);

  // مش مسجل؟ يروح login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // إيميله متفعل؟ ميقدرش يدخل OTP تاني
  if (isEmailVerified) return <Navigate to="/" replace />;

  return children;
};

export default VerifyEmailGuard;
