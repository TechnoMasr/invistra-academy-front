import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { NavLink } from "react-router";
import { FaRegBell, FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { openModal } from "@/store/modals/modalsSlice";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { PiCertificateLight, PiExam, PiMoneyWavyBold } from "react-icons/pi";

const ProfileSideBar = () => {
  const { t } = useTranslation();
  const [openSideBar, setOpenSideBar] = useState(false);
  const { lang } = useSelector((state) => state.language);
  const { settings } = useSelector((state) => state.settings);

  const dispatch = useDispatch();

  const links = [
    { name: "البيانات الشخصية", href: "/profile", icon: FaRegUser },
    {
      name: "الطلبات",
      href: "/profile/orders",
      icon: FiShoppingCart,
    },
    {
      name: "الكورسات",
      href: "/profile/my-courses",
      icon: MdOutlineOndemandVideo,
    },
    {
      name: "الاختبارات",
      href: "/profile/exams",
      icon: PiExam,
    },
    {
      name: "الكورسات2",
      href: "/profile/my-courses-teacher",
      icon: MdOutlineOndemandVideo,
    },
    {
      name: "الاختبارات2",
      href: "/profile/exams-teacher",
      icon: PiExam,
    },
    {
      name: "الشهادات",
      href: "/profile/certificates",
      icon: PiCertificateLight,
    },
    {
      name: "التحويلات المالية",
      href: "/profile/transactions",
      icon: PiMoneyWavyBold,
    },
    {
      name: "الاشعارات",
      href: "/profile/notifications",
      icon: FaRegBell,
    },
  ];

  const sideContent = (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          end
          className="sideBarLink"
          onClick={() => setOpenSideBar(false)}
        >
          <link.icon />
          {link.name}
        </NavLink>
      ))}

      <button
        onClick={() => dispatch(openModal({ modalName: "logOutModal" }))}
        className="sideBarLink danger"
      >
        <IoIosLogOut />
        تسجيل الخروج
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 p-6 bg-primary">
        <div className="sticky top-27">{sideContent}</div>
      </aside>

      <Sheet open={openSideBar} onOpenChange={setOpenSideBar}>
        <SheetTrigger asChild className="lg:hidden w-fit mt-4 ms-4">
          <Button variant="outline">
            <HiOutlineBars3 />
            القائمة
          </Button>
        </SheetTrigger>

        <SheetContent
          showCloseButton={false}
          side={lang === "ar" ? "right" : "left"}
          className="w-64 bg-primary"
        >
          <SheetTitle
            asChild
            className="flex items-center justify-center w-full"
          >
            <div className="w-40 h-20 overflow-hidden mt-4">
              <img
                loading="lazy"
                src={settings?.header_logo || logo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
          </SheetTitle>

          <SheetDescription className="sr-only"></SheetDescription>

          <div className="p-4">{sideContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileSideBar;
