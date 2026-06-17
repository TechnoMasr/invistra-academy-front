import useAuthGuard from "@/hooks/useAuthGuard";
import StudentLectures from "./StudentLectures";
import TeacherLectures from "./TeacherLectures";

const Lectures = () => {
  const { isInstructor, isStudent } = useAuthGuard();

  return (
    <>
      {isStudent && <StudentLectures />}
      {isInstructor && <TeacherLectures />}
    </>
  );
};

export default Lectures;
