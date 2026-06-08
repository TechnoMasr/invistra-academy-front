import LanguageSwitcher from "./LanguageSwitcher";
import { useDispatch, useSelector } from "react-redux";
import ProfileSide from "./ProfileSide";
import { HiMenuAlt3 } from "react-icons/hi";
import NotificationsPopUp from "./NotificationsPopUp";
import { openModal } from "@/store/modals/modalsSlice";
import CartIcon from "./CartIcon";

const HeaderActions = () => {
  const { user, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {user && (
        <>
          <NotificationsPopUp />

          <CartIcon user={user} />
        </>
      )}

      <LanguageSwitcher />

      <ProfileSide user={user} loading={loading} />

      <HiMenuAlt3
        className="header_icon lg:hidden text-3xl!"
        onClick={() => dispatch(openModal({ modalName: "mobileNav" }))}
      />
    </div>
  );
};

export default HeaderActions;
