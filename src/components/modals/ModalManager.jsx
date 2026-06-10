import LogOutModal from "./LogOutModal";
import RequiredLoginModal from "./RequiredLoginModal";
import RequiredVerifyEmailModal from "./RequiredVerifyEmailModal";
import TermsModal from "./TermsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LoadingModal from "./LoadingModal";
import ContactUsModal from "./ContactUsModal";
import PaymentModal from "./PaymentModal";
import SearchModal from "./SearchModal";

const ModalManager = () => {
  return (
    <>
      <LoadingModal />
      <SearchModal />
      <LogOutModal />
      <RequiredLoginModal />
      <RequiredVerifyEmailModal />
      <TermsModal />
      <ChangePasswordModal />
      <ContactUsModal />
      <PaymentModal />
    </>
  );
};

export default ModalManager;
