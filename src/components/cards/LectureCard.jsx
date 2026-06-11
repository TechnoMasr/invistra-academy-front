import { FaPlay } from "react-icons/fa";
import { Link } from "react-router";

const LectureCard = ({ item }) => {
  return (
    <Link
      to={`/profile/lecture-details/${item.id}`}
      className="border rounded-lg flex justify-between gap-3 p-3 hover:bg-primary/10 hover:border-primary transition duration-300 ease-in-out"
    >
      <div className="flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
          <FaPlay />
        </span>

        <h3 className="text-lg font-semibold">
          {item.number} - {item.title}
        </h3>
      </div>

      <p>{item.duration}</p>
    </Link>
  );
};

export default LectureCard;
