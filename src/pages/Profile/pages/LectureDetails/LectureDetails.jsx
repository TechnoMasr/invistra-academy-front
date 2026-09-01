import { FaEye, FaRegFolderOpen } from "react-icons/fa";
import { FiDownloadCloud, FiCheckCircle, FiChevronLeft } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa6";
import LectureDetailsSkeleton from "@/components/Loading/SkeletonLoading/LectureDetailsSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyLectureDetails } from "@/api/ordersServices";
import { useParams, Link } from "react-router";
import EmptyDataSection from "@/components/sections/EmptyDataSection";
import { useTranslation } from "react-i18next";
import { useDirectDownload } from "@/hooks/useDirectDownload";
import { setShowLecture } from "@/api/lectureServices";
import { buttonVariants } from "@/components/ui/button";

function isValidVideoUrl(url) {
  if (!url) return false;
  const trimmed = String(url).trim().toLowerCase();
  return (
    trimmed !== "" &&
    trimmed !== "0" &&
    trimmed !== "null" &&
    trimmed !== "undefined"
  );
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function getEmbedUrl(url) {
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return url;
}

const LectureDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { handleDownload, loadingMap } = useDirectDownload();

  // جلب بيانات المحاضرة
  const { data: lecture, isLoading } = useQuery({
    queryKey: ["lecture", id],
    queryFn: () => getMyLectureDetails(id),
  });

  // الـ Mutation الخاص بتحديث حالة المشاهدة
  const { mutate: markAsWatched, isPending: isWatching } = useMutation({
    mutationFn: () => setShowLecture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecture", id] });
    },
  });

  if (isLoading) return <LectureDetailsSkeleton />;

  const isEmpty = !isLoading && !lecture;

  if (isEmpty) return <EmptyDataSection msg={t("lectureDetails.noData")} />;

  const rawVideoSrc = lecture?.video_url || lecture?.video_path;
  const videoSrc = isValidVideoUrl(rawVideoSrc) ? rawVideoSrc : null;
  const embedUrl =
    videoSrc && !isDirectVideo(videoSrc) ? getEmbedUrl(videoSrc) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 shadow-md">
          {videoSrc && isDirectVideo(videoSrc) ? (
            <video
              src={videoSrc}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onEnded={() => {
                if (
                  !(lecture?.is_watched === 1 || lecture?.is_watched === true)
                ) {
                  markAsWatched();
                }
              }}
              className="w-full h-full object-cover"
            >
              {t("lectureDetails.videoNotSupported")}
            </video>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={lecture?.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-semibold">
              {t("lectureDetails.noVideo")}
            </div>
          )}
        </div>

        <div className="border rounded-2xl p-4">
          {/* قسم العنوان والزرار */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 border-b pb-3">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-start gap-1">
              <span className="text-white bg-primary rounded-full w-8 h-8 flex items-center justify-center mt-1 text-base">
                {lecture?.index}
              </span>{" "}
              {lecture?.title}
            </h1>

            {/* زرار حالة المشاهدة */}
            <div>
              {lecture?.is_watched === 1 || lecture?.is_watched === true ? (
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium text-sm border border-green-200 w-fit">
                  <FiCheckCircle className="text-lg" />
                  <span>{t("lectureDetails.watched")}</span>
                </div>
              ) : (
                <button
                  onClick={() => markAsWatched()}
                  disabled={isWatching}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-75 cursor-pointer w-fit"
                >
                  {isWatching ? (
                    "..."
                  ) : (
                    <>
                      <span>{t("lectureDetails.markAsWatched")}</span>
                      <FaEye className="text-lg" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div
            className="rich_content text-sm opacity-90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lecture?.description }}
          />

          {/* أزرار التنقل بين المحاضرات (التالية والسابقة) */}
          {(lecture?.prev_id || lecture?.next_id) && (
            <div className="flex items-center justify-between gap-3 pt-4 border-t mt-4">
              <Link
                to={`/profile/lecture-details/${lecture?.prev_id}`}
                disabled={!lecture?.prev_id}
                className={`rounded-lg gap-1!
              ${buttonVariants({ size: "sm", variant: "outline" })} 
              ${!lecture?.prev_id && "invisible"}`}
              >
                <FiChevronLeft className="text-lg rtl:rotate-180" />
                <span>{t("lectureDetails.previousLecture")}</span>
              </Link>

              <Link
                to={`/profile/lecture-details/${lecture?.next_id}`}
                disabled={!lecture?.next_id}
                className={`rounded-lg gap-1!
              ${buttonVariants({ size: "sm", variant: "outline" })} 
              ${!lecture?.next_id && "invisible"}`}
              >
                <span>{t("lectureDetails.nextLecture")}</span>
                <FiChevronLeft className="text-lg ltr:rotate-180" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-2xl p-4 h-fit">
        <div className="flex items-start gap-2 mb-1">
          <FaRegFolderOpen className="text-xl mt-1" />
          <h2 className="text-lg font-bold">
            {t("lectureDetails.attachments")}
          </h2>
        </div>
        <p className="opacity-80 text-sm mb-4">
          {t("lectureDetails.attachmentsDesc")}
        </p>

        {!lecture?.files?.length ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-primary bg-primary/10 border border-primary rounded-lg px-4 py-1 text-center font-semibold">
              {t("lectureDetails.noFiles")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lecture?.files?.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-amber-100 text-amber-400 p-2 rounded-lg flex flex-col items-center justify-center min-w-10">
                    <FaFilePdf className="text-2xl" />
                  </div>

                  <div>
                    <h4 className="font-medium text-sm break-all">
                      {file.name}
                    </h4>
                    <span className="text-xs opacity-70 block font-mono">
                      {file.size}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(file.url, file.name)}
                  disabled={loadingMap[file.url]}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingMap[file.url] ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <>
                      <FiDownloadCloud className="text-base" />
                      <span>{t("lectureDetails.download")}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureDetails;
