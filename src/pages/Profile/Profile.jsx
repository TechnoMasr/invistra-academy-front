import { Outlet } from "react-router";
import ProfileSideBar from "./ProfileSideBar";
import { getProfile } from "@/api/authServices";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "@/components/Loading/LoadingPage";

const Profile = () => {
  // eslint-disable-next-line no-unused-vars
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getProfile,
  });

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
