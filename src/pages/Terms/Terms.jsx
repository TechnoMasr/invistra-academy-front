import SectionTitle from "@/components/common/SectionTitle";
import TextSkeleton from "@/components/Loading/SkeletonLoading/TextSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();

  // const { data: page, isLoading } = useQuery({
  //   queryKey: ["page", "terms_conditions"],
  //   queryFn: () => getPages("terms_conditions"),
  // });

  const isLoading = false;

  return (
    <main className="container pagePadding">
      <SectionTitle title={t("termsAndConditions")} />

      {isLoading ? (
        <TextSkeleton />
      ) : (
        <>
          {/* <div
              className="rich_content"
              dangerouslySetInnerHTML={{ __html: page }}
            /> */}
        </>
      )}
    </main>
  );
};

export default Terms;
