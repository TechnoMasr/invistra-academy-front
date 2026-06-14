import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";

const TeacherCard = ({ teacher }) => {
  return (
    <Link
      to={`/teachers/${teacher.slug}`}
      key={teacher.id}
      className="border rounded-lg overflow-hidden bg-white text-center hover:shadow-xl hover:border-primary hover:bg-primary/5 transition duration-300 ease-in-out"
    >
      <div className="p-2">
        <div className="w-full aspect-5/4 overflow-hidden rounded-md mb-2">
          {teacher.image && (
            <img
              loading="lazy"
              src={teacher.image}
              alt={teacher.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <h3 className="text-xl font-semibold">{teacher.name}</h3>
        <p className="">{teacher.job_title}</p>
      </div>

      <p className="text-lg font-medium border-t p-2 flex items-center justify-center gap-2">
        <SlLayers />
        {teacher.category}
      </p>
    </Link>
  );
};

export default TeacherCard;
