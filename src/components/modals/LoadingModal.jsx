import { useSelector } from "react-redux";
import Loader from "../Loading/Loader";
import { createPortal } from "react-dom";

const LoadingModal = () => {
  const { modalName } = useSelector((state) => state.modals);

  if (!modalName) return null;

  if (modalName !== "loadingModal") return null;

  return createPortal(
    <section className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Loader textWhite={true} />
    </section>,
    document.body,
  );
};

export default LoadingModal;
