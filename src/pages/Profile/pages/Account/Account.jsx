import { selectIsInstructor, selectIsStudent } from "@/store/user/userSlice";
import { useSelector } from "react-redux";
import StudentAccount from "./StudentAccount";
import TeacherAccount from "./TeacherAccount";

const Account = () => {
  const isStudent = useSelector(selectIsStudent);
  const isInstructor = useSelector(selectIsInstructor);
  const { user } = useSelector((state) => state.user);

  return (
    <>
      {isStudent && <StudentAccount user={user} />}
      {isInstructor && <TeacherAccount user={user} />}
    </>
  );
};

export default Account;
