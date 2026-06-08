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
import { SlHandbag } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { FiCoffee } from "react-icons/fi";

const ProfileSideBar = () => {
  const { t } = useTranslation();
  const [openSideBar, setOpenSideBar] = useState(false);
  const { lang } = useSelector((state) => state.language);
  const { settings } = useSelector((state) => state.settings);

  const dispatch = useDispatch();

  const links = [
    { name: t("ProfileSideBar.profile"), href: "/profile", icon: FaRegUser },
    {
      name: t("ProfileSideBar.orders"),
      href: "/profile/orders",
      icon: SlHandbag,
    },
    {
      name: t("ProfileSideBar.eventOrders"),
      href: "/profile/event-orders",
      icon: FiCoffee,
    },
    {
      name: t("ProfileSideBar.favorites"),
      href: "/profile/favorites",
      icon: FaRegHeart,
    },
    {
      name: t("ProfileSideBar.notifications"),
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

      <hr className="" />

      <button
        onClick={() => dispatch(openModal({ modalName: "logOutModal" }))}
        className="sideBarLink danger"
      >
        <IoIosLogOut />
        {t("ProfileSideBar.logout")}
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block bg-card w-64 p-6 border-e ">
        <div className="sticky top-35">{sideContent}</div>
      </aside>

      <Sheet open={openSideBar} onOpenChange={setOpenSideBar}>
        <SheetTrigger asChild className="lg:hidden w-fit mt-4 ms-4">
          <Button variant="outline">
            <HiOutlineBars3 />
            {t("ProfileSideBar.menu")}
          </Button>
        </SheetTrigger>

        <SheetContent side={lang === "ar" ? "right" : "left"} className="w-64">
          <SheetTitle
            asChild
            className="flex items-center justify-center w-full"
          >
            <div className="w-32 h-12 overflow-hidden mt-4">
              <img
                loading="lazy"
                src={settings?.header_logo || logo}
                alt="logo"
                className="w-full h-full object-contain invert"
              />
            </div>
          </SheetTitle>

          <VisuallyHidden>
            <SheetDescription>
              {t("ProfileSideBar.sheetDescription")}
            </SheetDescription>
          </VisuallyHidden>

          <div className="p-4">{sideContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileSideBar;
