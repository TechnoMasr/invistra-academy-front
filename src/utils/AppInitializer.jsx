// components/AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { logout, setCredentials, setInitialized } from "@/store/auth/authSlice";
import Cookies from "js-cookie";
import { getProfile } from "@/api/authServices";
import LoadingPage from "@/components/Loading/LoadingPage";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const isInitialized = useSelector((s) => s.auth.isInitialized);
  const token = Cookies.get("token");

  // بيشتغل بس لو في token محفوظ
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await getProfile();
      dispatch(setCredentials({ user: data, token }));
      return data;
    },
    enabled: !!token && !isInitialized,
    retry: false,
    onError: () => {
      // لو الـ token expired أو invalid
      Cookies.remove("token");
      dispatch(logout());
      dispatch(setInitialized());
    },
  });

  // لو مفيش token أصلاً، خليه initialized على طول
  useEffect(() => {
    if (!token) dispatch(setInitialized());
  }, [token]);

  if (!isInitialized) return <LoadingPage />;

  return children;
}
