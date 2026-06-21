import useAuthGuard from "@/hooks/useAuthGuard";
import { Navigate } from "react-router";

const StudentExamGuard = ({ children }) => {
  const { isStudent } = useAuthGuard();

  if (!isStudent) return <Navigate to="/" replace />;

  return children;
};

export default StudentExamGuard;
