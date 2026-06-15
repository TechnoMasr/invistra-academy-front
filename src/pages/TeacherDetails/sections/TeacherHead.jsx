import bg from "@/assets/images/teacher-hero.jpg";
import { GoDotFill } from "react-icons/go";
import { SlLayers } from "react-icons/sl";

const TeacherHead = ({ data }) => {
  return (
    <section>
      <div
        className="relative h-48 w-full bg-primary bg-cover bg-center bg-no-repeat flex items-end"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="container relative">
          <div className="mb-4 ps-34 md:ps-58">
            <h1 className="text-white text-2xl md:text-3xl font-bold">
              {data?.name}
            </h1>
          </div>

          <div className="absolute -bottom-16 md:-bottom-24 inset-s-4 w-32 md:w-54 aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-200 z-10">
            {data?.image && (
              <img
                src={data?.image}
                alt={data?.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mt-4 ps-34 md:ps-58">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 font-bold mb-3">
            <p>{data?.job_title}</p>

            <GoDotFill className="hidden md:block" />

            {data?.category && (
              <p className="flex items-center gap-1">
                <SlLayers />
                {data?.category}
              </p>
            )}
          </div>

          <p className="text-sm lg:text-base text-primary/80 leading-snug">
            {data?.bio}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeacherHead;
