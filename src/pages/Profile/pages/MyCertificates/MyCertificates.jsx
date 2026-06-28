import { useState } from "react";
import CertificatesCard from "@/components/cards/CertificatesCard";
import { useTranslation } from "react-i18next";
import ProfileTitle from "@/components/common/ProfileTitle";
import MyCertificatesSkeleton from "@/components/Loading/SkeletonLoading/MyCertificatesSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getMyCertificates } from "@/api/myCoursesServices";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";

const MyCertificates = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { data: myCertificates, isLoading } = useQuery({
    queryKey: ["myCertificates", page],
    queryFn: () => getMyCertificates({ page }),
  });

  const isEmpty =
    !isLoading && (myCertificates?.items?.length === 0 || !myCertificates);

  const totalPages = myCertificates?.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("myCertificates.title")} />

      {isLoading ? (
        <MyCertificatesSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("myCertificates.emptyMessage")} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myCertificates?.items?.map((item) => (
              <CertificatesCard key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <MainPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyCertificates;
