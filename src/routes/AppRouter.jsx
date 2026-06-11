import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "../App";
import LoadingPage from "../components/Loading/LoadingPage";
import ProtectedRoute from "@/components/protectRoutes/ProtectedRoute";
import AuthGuard from "@/components/protectRoutes/AuthGuard";
import VerifyEmailGuard from "@/components/protectRoutes/VerifyEmailGuard";
import CheckVerifiedEmailGuard from "@/components/protectRoutes/CheckVerifiedEmailGuard";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Courses = React.lazy(() => import("../pages/Courses/Courses"));
const CourseDetails = React.lazy(
  () => import("../pages/CourseDetails/CourseDetails"),
);
const Teachers = React.lazy(() => import("../pages/Teachers/Teachers"));
const TeacherDetails = React.lazy(
  () => import("../pages/TeacherDetails/TeacherDetails"),
);

const Cart = React.lazy(() => import("../pages/Cart/Cart"));
const Payment = React.lazy(() => import("../pages/Payment/Payment"));

const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Account = React.lazy(
  () => import("../pages/Profile/pages/Account/Account"),
);
const Orders = React.lazy(() => import("../pages/Profile/pages/Orders/Orders"));
const MyCourses = React.lazy(
  () => import("../pages/Profile/pages/MyCourses/MyCourses"),
);
const MyCertificates = React.lazy(
  () => import("../pages/Profile/pages/MyCertificates/MyCertificates"),
);
const MyExams = React.lazy(
  () => import("../pages/Profile/pages/MyExams/MyExams"),
);
const OrderDetails = React.lazy(
  () => import("../pages/Profile/pages/OrderDetails/OrderDetails"),
);
const Lectures = React.lazy(
  () => import("../pages/Profile/pages/Lectures/Lectures"),
);
const LectureDetails = React.lazy(
  () => import("../pages/Profile/pages/LectureDetails/LectureDetails"),
);
const MyExamDetails = React.lazy(
  () => import("../pages/Profile/pages/MyExamDetails/MyExamDetails"),
);
const Notifications = React.lazy(
  () => import("../pages/Profile/pages/Notifications/Notifications"),
);
const AddCourse = React.lazy(
  () => import("../pages/Profile/pages/AddCourse/AddCourse"),
);
const EditCourse = React.lazy(
  () => import("../pages/Profile/pages/EditCourse/EditCourse"),
);
const AddLecture = React.lazy(
  () => import("../pages/Profile/pages/AddLecture/AddLecture"),
);
const AddExam = React.lazy(
  () => import("../pages/Profile/pages/AddExam/AddExam"),
);
const EditExam = React.lazy(
  () => import("../pages/Profile/pages/EditExam/EditExam"),
);
const MyCourses2 = React.lazy(
  () => import("../pages/Profile/pages/MyCourses/TeacherCourses"),
);
const MyExams2 = React.lazy(
  () => import("../pages/Profile/pages/MyExams/TeacherExams"),
);

const Login = React.lazy(() => import("../pages/Login/Login"));
const Register = React.lazy(() => import("../pages/Register/Register"));
const RegisterTeacher = React.lazy(
  () => import("../pages/Register/RegisterTeacher/RegisterTeacher"),
);
const RegisterStudent = React.lazy(
  () => import("../pages/Register/RegisterStudent/RegisterStudent"),
);
const VerifyEmail = React.lazy(
  () => import("../pages/VerifyEmail/VerifyEmail"),
);
const ForgotPassword = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPassword"),
);

const Terms = React.lazy(() => import("../pages/Terms/Terms"));
const Policy = React.lazy(() => import("../pages/Policy/Policy"));
// const SitePages = React.lazy(() => import("../pages/SitePages/SitePages"));

const NotFound = React.lazy(() => import("../pages/NotFound/NotFound"));
const ErrorPage = React.lazy(() => import("../pages/ErrorPage/ErrorPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:slug", element: <CourseDetails /> },
      { path: "/teachers", element: <Teachers /> },
      { path: "/teachers/:slug", element: <TeacherDetails /> },

      { path: "/terms-and-conditions", element: <Terms /> },
      { path: "/privacy-policy", element: <Policy /> },

      // { path: "/pages/:slug", element: <SitePages /> },

      // {
      //   path: "payment/:status?",
      //   element: <Payment />,
      // },

      {
        path: "/cart",
        element: <Cart />,
      },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/register/teacher", element: <RegisterTeacher /> },
      { path: "/register/student", element: <RegisterStudent /> },
      { path: "/forgot-password", element: <ForgotPassword /> },

      {
        path: "/profile",
        element: <Profile />,
        children: [
          { index: true, element: <Account /> },
          { path: "orders", element: <Orders /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "exams", element: <MyExams /> },
          { path: "certificates", element: <MyCertificates /> },
          { path: "order-details/:id", element: <OrderDetails /> },
          { path: "lectures/:id", element: <Lectures /> },
          { path: "lecture-details/:id", element: <LectureDetails /> },
          { path: "exam-details/:id", element: <MyExamDetails /> },
          { path: "notifications", element: <Notifications /> },
          { path: "add-course", element: <AddCourse /> },
          { path: "edit-course/:id", element: <EditCourse /> },
          { path: "add-lecture/:id", element: <AddLecture /> },
          { path: "add-exam", element: <AddExam /> },
          { path: "edit-exam/:id", element: <EditExam /> },
          { path: "my-courses-teacher", element: <MyCourses2 /> },
          { path: "exams-teacher", element: <MyExams2 /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          // {
          //   path: "/profile",
          //   element: <Profile />,
          //   children: [
          //     { index: true, element: <Account /> },
          //     { path: "orders", element: <Orders /> },
          //     { path: "event-orders", element: <EventOrders /> },
          //     { path: "event-orders/:id", element: <EventOrderDetails /> },
          //     { path: "favorites", element: <Favorites /> },
          //     { path: "notifications", element: <Notifications /> },
          //   ],
          // },
          // {
          //   path: "/cart",
          //   element: (
          //     <CheckVerifiedEmailGuard>
          //       <Cart />
          //     </CheckVerifiedEmailGuard>
          //   ),
          // },
          {
            path: "payment/:status?",
            element: (
              <CheckVerifiedEmailGuard>
                <Payment />
              </CheckVerifiedEmailGuard>
            ),
          },
        ],
      },

      // {
      //   element: <AuthGuard />,
      //   children: [
      //     { path: "/login", element: <Login /> },
      //     { path: "/register", element: <Register /> },
      //     { path: "/register/teacher", element: <RegisterTeacher /> },
      //     { path: "/register/student", element: <RegisterStudent /> },
      //     { path: "/forgot-password", element: <ForgotPassword /> },
      //   ],
      // },

      {
        path: "/verify-email",
        element: (
          <VerifyEmailGuard>
            <VerifyEmail />
          </VerifyEmailGuard>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;
