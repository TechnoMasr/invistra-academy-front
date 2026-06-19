import StudentAccount from "./StudentAccount";
import TeacherAccount from "./TeacherAccount";
import useAuthGuard from "@/hooks/useAuthGuard";

const Account = () => {
  const { isStudent, isInstructor } = useAuthGuard();

  return (
    <>
      {isStudent && <StudentAccount />}
      {isInstructor && <TeacherAccount />}
    </>
  );
};

export default Account;
