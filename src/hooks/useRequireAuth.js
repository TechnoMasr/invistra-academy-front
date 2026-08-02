import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";

const useRequireAuth = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const requireAuth = (onSuccess) => {
    if (!user) {
      dispatch(openModal({ modalName: "requiredLoginModal" }));
      return;
    }

    if (!user.is_verified) {
      dispatch(openModal({ modalName: "requiredVerifyEmailModal" }));
      return;
    }

    if (user?.type === "instructor" && !user?.category?.id) {
      dispatch(openModal({ modalName: "requiredSetCategoryModal" }));
      return;
    }

    onSuccess();
  };

  return requireAuth;
};

export default useRequireAuth;
