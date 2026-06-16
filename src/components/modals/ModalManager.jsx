import LogOutModal from "./LogOutModal";
import RequiredLoginModal from "./RequiredLoginModal";
import RequiredVerifyEmailModal from "./RequiredVerifyEmailModal";
import TermsModal from "./TermsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LoadingModal from "./LoadingModal";
import ContactUsModal from "./ContactUsModal";
import SuccessesPaymentModal from "./SuccessesPaymentModal";
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
      <SuccessesPaymentModal />
    </>
  );
};

export default ModalManager;
