import { getPages } from "@/api/mainServices";
import SectionTitle from "@/components/common/SectionTitle";
import TextSkeleton from "@/components/Loading/SkeletonLoading/TextSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation();

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "privacy"],
    queryFn: () => getPages("privacy"),
  });

  return (
    <main className="container pagePadding">
      <SectionTitle title={t("privacyPolicy")} />

      {isLoading ? (
        <TextSkeleton />
      ) : (
        <>
          <div
            className="rich_content"
            dangerouslySetInnerHTML={{ __html: page }}
          />
        </>
      )}
    </main>
  );
};

export default Policy;
