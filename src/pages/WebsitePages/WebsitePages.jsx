import { getPages } from "@/api/mainServices";
import SectionTitle from "@/components/common/SectionTitle";
import TextSkeleton from "@/components/Loading/SkeletonLoading/TextSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

const WebsitePages = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: () => getPages(slug),
  });

  return (
    <main className="container pagePadding">
      <SectionTitle title={t(`websitePages.${slug}`)} />

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

export default WebsitePages;
