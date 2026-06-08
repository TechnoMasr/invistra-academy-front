import MobileNav from "./MobileNav";
import LogOutModal from "./LogOutModal";
import RequiredLoginModal from "./RequiredLoginModal";
import RequiredVerifyEmailModal from "./RequiredVerifyEmailModal";
import TermsModal from "./TermsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LoadingModal from "./LoadingModal";
import ContactUsModal from "./ContactUsModal";

const ModalManager = () => {
  return (
    <>
      <LoadingModal />
      <MobileNav />
      <LogOutModal />
      <RequiredLoginModal />
      <RequiredVerifyEmailModal />
      <TermsModal />
      <ChangePasswordModal />
      <ContactUsModal />
    </>
  );
};

export default ModalManager;
