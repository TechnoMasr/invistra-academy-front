import useAuthGuard from "@/hooks/useAuthGuard";
import StudentCourses from "./StudentCourses";
import TeacherCourses from "./TeacherCourses";

const MyCourses = () => {
  const { isInstructor, isStudent } = useAuthGuard();

  return (
    <>
      {isStudent && <StudentCourses />}
      {isInstructor && <TeacherCourses />}
    </>
  );
};

export default MyCourses;
