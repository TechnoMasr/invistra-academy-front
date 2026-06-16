import useAuthGuard from "@/hooks/useAuthGuard";
import StudentExams from "./StudentExams";
import TeacherExams from "./TeacherExams";

const MyExams = () => {
  const { isInstructor, isStudent } = useAuthGuard();

  return (
    <>
      {isStudent && <StudentExams />}
      {isInstructor && <TeacherExams />}
    </>
  );
};

export default MyExams;
