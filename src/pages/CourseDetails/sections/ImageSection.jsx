import { useState } from "react";
import { GoPlay } from "react-icons/go";
import { X } from "lucide-react";

// ─── helpers ───────────────────────────────────────────────
function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function getEmbedUrl(url) {
  // Google Drive
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  // fallback
  return url;
}
// ───────────────────────────────────────────────────────────

const ImageSection = ({ data }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <>
      <div className="aspect-6/4 rounded-xl border overflow-hidden order-1 lg:order-2 relative">
        {data?.image && (
          <img
            src={data?.image}
            alt={data?.name}
            className="w-full h-full object-cover"
          />
        )}

        {data?.link && (
          <button
            onClick={() => setShowVideoModal(true)}
            className="absolute inset-0 bg-black/50 flex items-center justify-center w-full cursor-pointer"
          >
            <GoPlay className="text-[100px] text-white" />
          </button>
        )}
      </div>

      {/* ─── Video Modal ─────────────────────────────────────── */}
      {showVideoModal && data?.link && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              {isDirectVideo(data.link) ? (
                <video
                  src={data.link}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(data.link)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSection;
