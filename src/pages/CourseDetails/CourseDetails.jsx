import { useQuery } from "@tanstack/react-query";
import Details from "./sections/Details";
import WhatLearn from "./sections/WhatLearn";
import { getCourseDetails } from "@/api/coursesServices";
import { useParams } from "react-router";
import SeoManager from "@/utils/SeoManager";

const CourseDetails = () => {
  const { slug } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ["courseDetails", slug],
    queryFn: () => getCourseDetails(slug),
  });

  return (
    <>
      <SeoManager
        title={course?.seo?.meta_title}
        description={course?.seo?.meta_description}
        keywords={course?.seo?.keywords}
        canonical={course?.seo?.canonical_url}
        ogImage={course?.seo?.og_image}
      />

      <main>
        <Details isLoading={isLoading} data={course} />
        <WhatLearn isLoading={isLoading} data={course?.what_will_learn} />
      </main>
    </>
  );
};

export default CourseDetails;
