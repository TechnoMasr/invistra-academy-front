import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUser } from "react-icons/fa6";
import { FiCoffee, FiShoppingCart } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import UserAvatar from "@/components/common/UserAvatar";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { openModal } from "@/store/modals/modalsSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const ProfileSide = ({ user, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const links = [
    { name: t("ProfileSideBar.profile"), href: "/profile", icon: FaRegUser },
    {
      name: t("ProfileSideBar.orders"),
      href: "/profile/orders",
      icon: FiShoppingCart,
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
  ];

  return (
    <>
      {loading ? (
        <Skeleton className="h-9 w-9 rounded-full" />
      ) : user ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <UserAvatar
              name={user?.name}
              image={user?.image}
              className="cursor-pointer"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserAvatar name={user?.name} image={user?.image} />
              <h3 className="font-semibold">{user?.name}</h3>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {links.map((link) => (
              <DropdownMenuItem
                key={link.name}
                onClick={() => navigate(link.href)}
              >
                <link.icon />
                {link.name}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                dispatch(openModal({ modalName: "logOutModal" }));
              }}
            >
              <IoIosLogOut />
              {t("ProfileSide.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          className={`lg:min-w-40`}
        >
          {t("ProfileSide.login")}
        </Button>
      )}
    </>
  );
};

export default ProfileSide;
