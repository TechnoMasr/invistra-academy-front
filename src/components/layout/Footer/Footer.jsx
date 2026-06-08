import React from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/logo.png";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaTiktok } from "react-icons/fa";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFooter } from "@/api/mainServices";
import FooterSkeleton from "@/components/Loading/SkeletonLoading/FooterSkeleton";
import { FiInstagram } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { openModal } from "@/store/modals/modalsSlice";
import { useDispatch } from "react-redux";

const Footer = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // const { data: footerData, isLoading } = useQuery({
  //   queryKey: ["footer"],
  //   queryFn: getFooter,
  // });

  // if (isLoading) return <FooterSkeleton />;

  const footerData = [];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: footerData?.facebook || "/",
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      url: footerData?.instagram || "/",
    },

    { name: "Youtube", icon: <FaYoutube />, url: footerData?.youtube || "/" },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: footerData?.linkedin || "/",
    },
    { name: "Tiktok", icon: <FaTiktok />, url: footerData?.tiktok || "/" },
  ];

  return (
    <footer className="sectionPadding bg-primary text-white">
      <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center gap-4 justify-between">
        <img
          loading="lazy"
          src={logo}
          alt="Company Logo"
          className="w-28 md:w-40 object-contain"
        />

        <p className="text-center">
          Invistra Academy هي منصة تعليمية رقمية تهدف إلى تقديم تجربة تعلم حديثة
          ومرنة، تجمع بين الدورات التدريبية المتخصصة والمحتوى التفاعلي لمساعدة
          المتعلمين على تطوير مهاراتهم واكتساب المعرفة بسهولة من أي مكان وفي أي
          وقت.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-3">
          {socialLinks.map((link) => (
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

        <div className="flex items-center justify-center flex-wrap gap-1 lg:gap-3">
          <Link
            to="/privacy-policy"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("privacyPolicy")}
          </Link>
          <GoDotFill />
          <Link
            to="/terms-and-conditions"
            className="hover:text-secondary transition-all duration-300"
          >
            {t("termsAndConditions")}
          </Link>
          <GoDotFill />
          <button
            onClick={() => dispatch(openModal({ modalName: "ContactUsModal" }))}
            className="hover:text-secondary transition-all duration-300 cursor-pointer"
          >
            {t("contactUs")}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
