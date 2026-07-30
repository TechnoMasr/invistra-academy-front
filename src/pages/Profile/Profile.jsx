import { useEffect } from "react";
import { Outlet } from "react-router";
import ProfileSideBar from "./ProfileSideBar";
import { getProfile } from "@/api/authServices";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "@/components/Loading/LoadingPage";

// 1. استيراد الأدوات المطلوبة من Redux
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setCredentials } from "@/store/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  // (اختياري) لو عاوز تحافظ على التوكن القديم اللي في الستيت
  const currentToken = useSelector((state) => state.auth.token);

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getProfile,
  });

  // 2. استخدام useEffect لمراقبة نجاح الفيتش وتحديث Redux
  useEffect(() => {
    if (isSuccess && user) {
      dispatch(
        setCredentials({
          user: user,
          token: currentToken || Cookies.get("token") || null, // بنجيب التوكن المتاح عشان ميبقاش null
        }),
      );
    }
  }, [isSuccess, user, currentToken, dispatch]);

  if (isLoading) return <LoadingPage />;

  return (
    <article className="flex flex-col lg:flex-row w-full">
      <ProfileSideBar />

      <section className="flex-1 min-h-[calc(100vh-90px)] w-full max-w-350 mx-auto px-4 py-6 md:px-6">
        <Outlet />
      </section>
    </article>
  );
};

export default Profile;
