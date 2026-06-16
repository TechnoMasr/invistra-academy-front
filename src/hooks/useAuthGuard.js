// hooks/useAuthGuard.js
import { useSelector } from "react-redux";
import {
  selectIsStudent,
  selectIsInstructor,
  selectUser,
} from "@/store/user/userSlice";

const useAuthGuard = () => {
  const { loading } = useSelector((state) => state.user);
  const isStudent = useSelector(selectIsStudent);
  const isInstructor = useSelector(selectIsInstructor);
  const user = useSelector(selectUser);

  return { isStudent, isInstructor, user, loading };
};

export default useAuthGuard;
