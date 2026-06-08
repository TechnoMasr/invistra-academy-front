import Hero from "./sections/Hero";
import StatsSection from "./sections/StatsSection";
import CoursesSection from "./sections/CoursesSection";
import { useQuery } from "@tanstack/react-query";
import { getHome } from "@/api/homeServices";
import SeoManager from "@/utils/SeoManager";

const Home = () => {
  // const { data: homeData, isLoading } = useQuery({
  //   queryKey: ["home"],
  //   queryFn: getHome,
  // });

  return (
    <>
      {/* <SeoManager
        title={homeData?.home_seo?.meta_title}
        description={homeData?.home_seo?.meta_description}
        keywords={homeData?.home_seo?.keywords}
        canonical={homeData?.home_seo?.canonical_url}
        ogImage={homeData?.home_seo?.og_image}
      /> */}

      <main>
        <Hero />
        <StatsSection />
        <CoursesSection />
      </main>
    </>
  );
};

export default Home;
