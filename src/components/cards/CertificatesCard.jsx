import { FiDownloadCloud } from "react-icons/fi";
import { Button } from "../ui/button";
import { SlLayers } from "react-icons/sl";
import { ImLinkedin } from "react-icons/im";
import { useTranslation } from "react-i18next";
import { useDirectDownload } from "@/hooks/useDirectDownload"; // ← استوردها

const CertificatesCard = ({ item }) => {
  const { t } = useTranslation();
  const { handleDownload, loadingMap } = useDirectDownload(); // ← استخدمها

  const handleLinkedInShare = () => {
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: item?.course_name,
      organizationId: "YOUR_ORG_ID",
      issueYear: new Date().getFullYear(),
      issueMonth: new Date().getMonth() + 1,
      certUrl: item?.file_path,
      certId: item?.id,
    });
    window.open(
      `https://www.linkedin.com/profile/add?${params.toString()}`,
      "_blank",
    );
  };

  return (
    <div key={item?.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="w-full aspect-5/3 overflow-hidden rounded-md">
        <iframe
          src={`${item?.file_path}#toolbar=0&scrollbar=0`}
          title={item?.course_name}
          className="w-full h-full overflow-hidden pointer-events-none"
          scrolling="no"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold line-clamp-2">{item?.course_name}</h3>

        <p className="flex items-center gap-1 font-semibold text-sm">
          <SlLayers />
          {item?.category_name}
        </p>

        <div className="flex items-center gap-2">
          <div className="w-8 aspect-square overflow-hidden rounded-full">
            {item?.instructor_image && (
              <img
                loading="lazy"
                src={item?.instructor_image}
                alt={item?.instructor_name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h4 className="font-medium">{item?.instructor_name}</h4>
        </div>

        <Button
          className="w-full"
          disabled={loadingMap[item?.file_path]}
          onClick={() =>
            handleDownload(
              item?.file_path,
              `${item?.course_name || "certificate"}.pdf`,
            )
          }
        >
          {loadingMap[item?.file_path]
            ? t("downloading") // ← مفتاح ترجمة جديد، أو استخدم نص ثابت "..."
            : t("certificatesCard.downloadCertificate")}
          <FiDownloadCloud />
        </Button>

        <Button variant="outline" onClick={handleLinkedInShare}>
          {t("certificatesCard.shareOnLinkedIn")}
          <ImLinkedin className="w-5 h-5 text-[#0077B5]" />
        </Button>
      </div>
    </div>
  );
};

export default CertificatesCard;
