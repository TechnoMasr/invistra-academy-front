import StudentAccount from "./StudentAccount";
import TeacherAccount from "./TeacherAccount";
import useAuthGuard from "@/hooks/useAuthGuard";

const Account = () => {
  const { isStudent, isInstructor, user } = useAuthGuard();

  return (
    <>
      {isStudent && <StudentAccount user={user} />}
      {isInstructor && <TeacherAccount user={user} />}
    </>
  );
};

export default Account;
