import { Outlet } from "react-router";
import ProfileSideBar from "./ProfileSideBar";

const Profile = () => {
  return (
    <article className="flex flex-col lg:flex-row pt-20 md:pt-22 w-full max-w-7xl mx-auto">
      <ProfileSideBar />

      <section className="flex-1 min-h-[90vh] p-4 lg:p-6">
        <Outlet />
      </section>
    </article>
  );
};

export default Profile;
