import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import SearchInput from "../layout/Header/SearchInput";

const SearchModal = () => {
  const dispatch = useDispatch();
  const { modalName } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={modalName === "SearchModal"} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl bg-primary top-10! rounded-full border-none p-2"
        showCloseButton={false}
      >
        <DialogHeader className={`sr-only`}>
          <DialogTitle className="text-center"></DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <SearchInput />
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
