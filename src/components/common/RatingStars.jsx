import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({
  rating = 0,
  max = 5,
  size = 16,
  color = "text-yellow-500",
}) => {
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;

        // Full star
        if (rating >= starValue) {
          return <FaStar key={index} size={size} className={`${color}`} />;
        }

        // Half star
        if (rating >= starValue - 0.5) {
          return (
            <div
              key={index}
              className="relative"
              style={{ width: size, height: size }}
            >
              {/* Empty star background */}
              <FaRegStar
                size={size}
                className={`${color} absolute top-0 left-0`}
              />

              {/* Half filled star */}
              <FaStar
                size={size}
                className={`${color} absolute top-0 left-0`}
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            </div>
          );
        }

        // Empty star
        return <FaRegStar key={index} size={size} className={color} />;
      })}
    </div>
  );
};

export default RatingStars;
