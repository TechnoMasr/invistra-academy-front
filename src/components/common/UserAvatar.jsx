import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({
  name,
  image,
  size = 35, // default size
  className = "",
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <Avatar
      className={`${className} border border-primary`}
      style={{
        width: size,
        height: size,
      }}
    >
      {image && (
        <AvatarImage
          src={image}
          alt={name}
          className={`object-cover`}
        />
      )}
      <AvatarFallback className="text-primary" style={{ fontSize: size / 2 }}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
