import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "../App";
import LoadingPage from "../components/Loading/LoadingPage";
import ProtectedRoute from "@/components/protectRoutes/ProtectedRoute";
import AuthGuard from "@/components/protectRoutes/AuthGuard";
import VerifyEmailGuard from "@/components/protectRoutes/VerifyEmailGuard";
import CheckVerifiedEmailGuard from "@/components/protectRoutes/CheckVerifiedEmailGuard";
import RoleGuard from "@/components/protectRoutes/RoleGuard";
import CheckSetCategory from "@/components/protectRoutes/CheckSetCategory";

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
const ExamResult = React.lazy(
  () => import("../pages/Profile/pages/ExamResult/ExamResult"),
);
const EnterExam = React.lazy(
  () => import("../pages/Profile/pages/ExamResult/EnterExam"),
);
const Notifications = React.lazy(
  () => import("../pages/Profile/pages/Notifications/Notifications"),
);
const Transactions = React.lazy(
  () => import("../pages/Profile/pages/Transactions/Transactions"),
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
const EditLecture = React.lazy(
  () => import("../pages/Profile/pages/EditLecture/EditLecture"),
);
const AddExam = React.lazy(
  () => import("../pages/Profile/pages/AddExam/AddExam"),
);
const EditExam = React.lazy(
  () => import("../pages/Profile/pages/EditExam/EditExam"),
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

const WebsitePages = React.lazy(
  () => import("../pages/WebsitePages/WebsitePages"),
);

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
      { path: "/instructors", element: <Teachers /> },
      { path: "/instructors/:slug", element: <TeacherDetails /> },

      { path: "/page/:slug", element: <WebsitePages /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
            children: [
              { index: true, element: <Account /> },
              {
                path: "orders",
                element: (
                  <RoleGuard allowedRole="student">
                    <Orders />
                  </RoleGuard>
                ),
              },
              { path: "my-courses", element: <MyCourses /> },
              { path: "exams", element: <MyExams /> },
              {
                path: "certificates",
                element: (
                  <RoleGuard allowedRole="student">
                    <MyCertificates />
                  </RoleGuard>
                ),
              },
              {
                path: "order-details/:id",
                element: (
                  <RoleGuard allowedRole="student">
                    <OrderDetails />
                  </RoleGuard>
                ),
              },
              { path: "lectures/:id", element: <Lectures /> },
              {
                path: "lecture-details/:id",
                element: (
                  <RoleGuard allowedRole="student">
                    <LectureDetails />
                  </RoleGuard>
                ),
              },
              {
                path: "exam-result/:id",
                element: (
                  <RoleGuard allowedRole="student">
                    <ExamResult />
                  </RoleGuard>
                ),
              },
              {
                path: "transactions",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <Transactions />
                  </RoleGuard>
                ),
              },
              { path: "notifications", element: <Notifications /> },
              {
                path: "add-course",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <CheckSetCategory>
                      <AddCourse />
                    </CheckSetCategory>
                  </RoleGuard>
                ),
              },
              {
                path: "edit-course/:id",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <EditCourse />
                  </RoleGuard>
                ),
              },
              {
                path: "add-lecture/:id",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <AddLecture />
                  </RoleGuard>
                ),
              },
              {
                path: "edit-lecture/:id",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <EditLecture />
                  </RoleGuard>
                ),
              },
              {
                path: "add-exam",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <CheckSetCategory>
                      <AddExam />
                    </CheckSetCategory>
                  </RoleGuard>
                ),
              },
              {
                path: "edit-exam/:id",
                element: (
                  <RoleGuard allowedRole="instructor">
                    <EditExam />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "/cart",
            element: (
              <CheckVerifiedEmailGuard>
                <RoleGuard allowedRole="student">
                  <Cart />
                </RoleGuard>
              </CheckVerifiedEmailGuard>
            ),
          },
          {
            path: "/payment/:status?/:payment_id?",
            element: (
              <CheckVerifiedEmailGuard>
                <RoleGuard allowedRole="student">
                  <Payment />
                </RoleGuard>
              </CheckVerifiedEmailGuard>
            ),
          },
        ],
      },

      {
        element: <AuthGuard />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/register/instructor", element: <RegisterTeacher /> },
          { path: "/register/student", element: <RegisterStudent /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
        ],
      },

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
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/enter-exam/:id",
        element: (
          <RoleGuard allowedRole="student">
            <EnterExam />
          </RoleGuard>
        ),
      },
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
