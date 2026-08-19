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

  const websitePages = [
    {
      name: t("websitePages.privacy"),
      url: "/page/privacy",
    },
    {
      name: t("websitePages.terms"),
      url: "/page/terms",
    },
    {
      name: t("websitePages.refund"),
      url: "/page/refund",
    },
    {
      name: t("websitePages.about"),
      url: "/page/about",
    },
    {
      name: t("websitePages.shipping"),
      url: "/page/shipping",
    },
    {
      name: t("websitePages.pricing"),
      url: "/page/pricing",
    },
  ];

  const quickLinks = [
    {
      name: t("instructors"),
      url: "/instructors",
    },
    {
      name: t("courses"),
      url: "/courses",
    },
    {
      name: t("registerAsTeacher"),
      url: "/register/teacher",
    },
  ];

  return (
    <footer className="sectionPadding bg-[#111418] text-white">
      <div className="container flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4">
        {/* قسم اللوجو والشبكات الاجتماعية */}
        <div className="flex flex-col items-start gap-4">
          {footerData?.logo && (
            <img
              loading="lazy"
              src={footerData?.logo}
              alt="Company Logo"
              className="w-56 object-contain"
            />
          )}

          <p className="text-start lg:max-w-80">{footerData?.footer_text}</p>

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

        {/* قسم الروابط السريعة */}
        <div className="flex flex-col items-start gap-3">
          <h4 className="text-lg font-bold mb-1 text-secondary">
            {t("quickLinks")}
          </h4>

          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.url}
              className="hover:text-secondary transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* قسم الصفحات الهامة */}
        <div className="flex flex-col items-start gap-3">
          <h4 className="text-lg font-bold mb-1 text-secondary">
            {t("importantPages")}
          </h4>

          {websitePages.map((page) => (
            <Link
              key={page.name}
              to={page.url}
              className="hover:text-secondary transition-all duration-300"
            >
              {page.name}
            </Link>
          ))}

          <button
            onClick={() => dispatch(openModal({ modalName: "ContactUsModal" }))}
            className="hover:text-secondary transition-all duration-300 cursor-pointer text-start"
          >
            {t("contactUs")}
          </button>
        </div>
      </div>

      {/* الحقوق والـ Branding */}
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
