// components/protectRoutes/RoleGuard.jsx
import { Navigate } from "react-router";
import useAuthGuard from "@/hooks/useAuthGuard";

const RoleGuard = ({ allowedRole, children }) => {
  const { isStudent, isInstructor } = useAuthGuard();

  if (allowedRole === "instructor" && !isInstructor)
    return <Navigate to="/profile" replace />;

  if (allowedRole === "student" && !isStudent)
    return <Navigate to="/profile" replace />;

  return children;
};

export default RoleGuard;
