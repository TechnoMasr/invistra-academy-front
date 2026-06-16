import CourseCard from "@/components/cards/CourseCard";
import TeacherHead from "./sections/TeacherHead";
import { useParams } from "react-router";
import { getInstructorDetails } from "@/api/instructorsServices";
import { useQuery } from "@tanstack/react-query";
import SeoManager from "@/utils/SeoManager";
import TeacherDetailsSkeleton from "@/components/Loading/SkeletonLoading/TeacherDetailsSkeleton";

const TeacherDetails = () => {
  const { slug } = useParams();

  const { data: instructor, isLoading } = useQuery({
    queryKey: ["instructorDetails", slug],
    queryFn: () => getInstructorDetails(slug),
  });

  if (isLoading) return <TeacherDetailsSkeleton />;

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
        <TeacherHead data={instructor} />

        <section className="container pagePadding space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructor?.courses.map((item) => (
              <CourseCard key={item.id} course={item} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default TeacherDetails;
