import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import CourseCard from "@/components/cards/CourseCard";
import MainPagination from "@/components/common/MainPagination";
import TeacherHead from "./sections/TeacherHead";
import { useParams } from "react-router";
import { getInstructorDetails } from "@/api/instructorsServices";
import { useQuery } from "@tanstack/react-query";
import SeoManager from "@/utils/SeoManager";

const TeacherDetails = () => {
  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "اللغة الانجليزية - المستوى الأول",
    description:
      "طوّر مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل والحياة اليومية",
    image: image,
    price: 50,
    lecture_number: 12,
    teacher: {
      name: "بودا سلطان",
      image: userImg,
    },
    slug: "بودا-سلطان",
  }));

  const { slug } = useParams();

  const { data: instructor, isLoading } = useQuery({
    queryKey: ["instructorDetails", slug],
    queryFn: () => getInstructorDetails(slug),
  });

  return (
    <>
      <SeoManager
        title={instructor?.seo?.meta_title}
        description={instructor?.seo?.meta_description}
        keywords={instructor?.seo?.keywords}
        canonical={instructor?.seo?.canonical_url}
        ogImage={instructor?.seo?.og_image}
      />

      <main>
        <TeacherHead isLoading={isLoading} data={instructor} />

        <section className="container pagePadding space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructor?.courses.map((item) => (
              <CourseCard key={item.id} course={item} />
            ))}
          </div>

          <MainPagination
            totalPages={10}
            currentPage={1}
            onPageChange={() => {}}
          />
        </section>
      </main>
    </>
  );
};

export default TeacherDetails;
