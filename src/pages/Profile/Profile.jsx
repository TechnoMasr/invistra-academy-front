import { Outlet } from "react-router";
import ProfileSideBar from "./ProfileSideBar";

const Profile = () => {
  return (
    <article className="flex flex-col lg:flex-row w-full">
      <ProfileSideBar />

      <section className="flex-1 min-h-[90vh] px-4 py-6 md:px-6">
        <Outlet />
      </section>
    </article>
  );
};

export default Profile;
