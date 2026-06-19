// hooks/useAuthGuard.js
import { useSelector } from "react-redux";

const useAuthGuard = () => {
  const { user } = useSelector((state) => state.auth);
  const isStudent = user?.type === "student";
  const isInstructor = user?.type === "instructor";

  return { isStudent, isInstructor, user };
};

export default useAuthGuard;
