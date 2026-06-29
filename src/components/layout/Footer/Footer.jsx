import twmLogo from "@/assets/images/twm-logo.png";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaTiktok } from "react-icons/fa";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFooter } from "@/api/mainServices";
import FooterSkeleton from "@/components/Loading/SkeletonLoading/FooterSkeleton";
import { FiInstagram } from "react-icons/fi";
import { openModal } from "@/store/modals/modalsSlice";
import { useDispatch } from "react-redux";

const Footer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: footerData, isLoading } = useQuery({
    queryKey: ["footer"],
    queryFn: getFooter,
  });

  if (isLoading) return <FooterSkeleton />;

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: footerData?.social_links?.facebook,
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      url: footerData?.social_links?.instagram,
    },
    {
      name: "Youtube",
      icon: <FaYoutube />,
      url: footerData?.social_links?.youtube,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: footerData?.social_links?.linkedin,
    },
    {
      name: "Tiktok",
      icon: <FaTiktok />,
      url: footerData?.social_links?.tiktok,
    },
  ];

  return (
    <footer className="sectionPadding bg-[#111418] text-white">
      <div className="container flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4">
        <div className="flex flex-col items-center lg:items-start gap-4">
          {footerData?.logo && (
            <img
              loading="lazy"
              src={footerData?.logo}
              alt="Company Logo"
              className="w-56 object-contain"
            />
          )}

          <p className="text-center lg:text-start max-w-80">
            {footerData?.footer_text}
          </p>

          <div className="flex items-center justify-center flex-wrap gap-3">
            {socialLinks
              .filter((link) => link.url)
              .map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-secondary transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3">
          <Link
            to="/teachers"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("teachers")}
          </Link>

          <Link
            to="/courses"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("courses")}
          </Link>

          <Link
            to="/register/teacher"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("registerAsTeacher")}
          </Link>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3">
          <Link
            to="/privacy-policy"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("privacyPolicy")}
          </Link>

          <Link
            to="/terms-and-conditions"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("termsAndConditions")}
          </Link>

          <button
            onClick={() => dispatch(openModal({ modalName: "ContactUsModal" }))}
            className="hover:text-secondary transition-all duration-300 cursor-pointer"
          >
            {t("contactUs")}
          </button>
        </div>
      </div>

      <div className="container mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
        <span>{t("developedBy")}</span>
        <a
          href="https://technomasr.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:scale-105"
        >
          <img src={twmLogo} alt="TWM Logo" className="h-8 object-contain" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
