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

const HeaderActions = ({ showMobileNav, setShowMobileNav }) => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);

  // const user = {
  //   name: "John Doe",
  //   image:
  //     "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  // };
  // // const user = null;
  // const loading = false;

  return (
    <div className="flex items-center gap-2 2xl:gap-4">
      <LanguageSwitcher />

      <Button
        onClick={() => dispatch(openModal({ modalName: "SearchModal" }))}
        size="icon"
        className="rounded-full lg:hidden"
      >
        <IoSearchOutline />
      </Button>

      {user && (
        <>
          <NotificationsPopUp />

          <CartIcon user={user} />
        </>
      )}
      <ProfileSide user={user} loading={loading} />
      <div
        className="lg:hidden text-3xl cursor-pointer"
        onClick={() => setShowMobileNav((prev) => !prev)}
      >
        {showMobileNav ? <CgClose /> : <HiMenuAlt3 />}
      </div>
    </div>
  );
};

export default HeaderActions;
