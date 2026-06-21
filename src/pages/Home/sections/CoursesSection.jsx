import { useTranslation } from "react-i18next";
import SectionTitle from "@/components/common/SectionTitle";
import { useState } from "react";
import CourseCard from "@/components/cards/CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getCourses } from "@/api/homeServices";
import CoursesSectionSkeleton from "@/components/Loading/SkeletonLoading/CoursesSectionSkeleton";

const CoursesSection = ({ data, loading }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const { data: categories, isLoading } = useQuery({
    queryKey: ["home-categories"],
    queryFn: getCategories,
  });

  const { data: courses, isLoadingCourses } = useQuery({
    queryKey: ["home-courses", selectedCategory],
    queryFn: () => getCourses(selectedCategory),
  });

  if (loading || isLoading || isLoadingCourses)
    return <CoursesSectionSkeleton />;

  const categoriesList = [
    { id: null, name: t("coursesSection.all") },
    ...(Array.isArray(categories) ? categories : []),
  ];

  return (
    <section className="sectionPadding relative">
      <div className="absolute inset-0 rounded-3xl opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[86px_86px] z-0"></div>

      <div className="container relative z-10">
        <SectionTitle title={data?.title} description={data?.description} />

        <ul className="flex justify-center flex-wrap gap-2 mb-8">
          {categoriesList?.map((category) => (
            <li
              key={category.id}
              className={`px-4 py-2 rounded-full cursor-pointer bg-white border hover:bg-primary hover:text-white transition duration-300 ease-in-out ${
                selectedCategory === category.id ? "bg-primary! text-white" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses?.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link to="/courses" className="rounded-full">
            <Button className="px-6">{t("coursesSection.moreCourses")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
