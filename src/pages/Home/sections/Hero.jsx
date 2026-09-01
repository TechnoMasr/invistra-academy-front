import { useTranslation } from "react-i18next";
import HeroSkeleton from "@/components/Loading/SkeletonLoading/HeroSkeleton";
import { Button } from "@/components/ui/button";
import { MdOndemandVideo } from "react-icons/md";
import { Link } from "react-router";

const Hero = ({ data = {}, loading }) => {
  const { t } = useTranslation();
  if (loading) return <HeroSkeleton />;

  if (!data || (!data?.title && !data?.description && !data?.image))
    return null;

  return (
    <section className="bg-white flex items-center sectionPadding">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-22 items-center justify-center">
          <div className="lg:w-1/2 h-full relative order-2 lg:order-1">
            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-start gap-4 lg:gap-6 relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-normal">
                {data?.title}
              </h1>

              <div
                className="rich_content lg:text-lg"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />

              <Link to="/courses" className="btn btn-primary w-full md:w-auto">
                <Button className="rounded-full px-6!">
                  {t("hero.exploreCourses")} <MdOndemandVideo />
                </Button>
              </Link>
            </div>
          </div>

          {data?.image && (
            <div className="w-[70%] sm:w-[40%] lg:w-1/2 max-w-100 flex justify-center relative order-1 lg:order-2">
              <img
                src={data?.image}
                alt="Hero"
                className="w-full h-full max-h-150 object-contain relative z-10"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
