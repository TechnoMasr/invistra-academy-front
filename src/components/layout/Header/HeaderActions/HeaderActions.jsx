import LanguageSwitcher from "./LanguageSwitcher";
import ProfileSide from "./ProfileSide";
import { HiMenuAlt3 } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import NotificationsPopUp from "./NotificationsPopUp";
import CartIcon from "./CartIcon";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/store/modals/modalsSlice";
import useAuthGuard from "@/hooks/useAuthGuard";

const HeaderActions = ({ showMobileNav, setShowMobileNav }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isInstructor } = useAuthGuard();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <LanguageSwitcher />

      <Button
        onClick={() => dispatch(openModal({ modalName: "SearchModal" }))}
        size="icon"
        className="rounded-full xl:hidden"
      >
        <IoSearchOutline />
      </Button>

      {user && (
        <>
          <NotificationsPopUp />

          {!isInstructor && <CartIcon user={user} />}
        </>
      )}
      <ProfileSide user={user}  />
      <div
        className="xl:hidden text-3xl cursor-pointer"
        onClick={() => setShowMobileNav((prev) => !prev)}
      >
        {showMobileNav ? <CgClose /> : <HiMenuAlt3 />}
      </div>
    </div>
  );
};

export default HeaderActions;
