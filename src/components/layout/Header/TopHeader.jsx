import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";

const TopHeader = () => {
  const { settings } = useSelector((state) => state.settings);
  const { lang } = useSelector((state) => state.language);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const isRTL = lang === "ar";

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setShouldScroll(textWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [settings?.top_bar_content]);

  return (
    <div>
      <div
        ref={containerRef}
        className="bg-[#A4996C] text-white p-1 h-8 overflow-hidden flex items-center"
      >
        {shouldScroll ? (
          <div className="marquee-wrapper">
            <span
              ref={textRef}
              className="marquee-content"
              style={{ animationName: isRTL ? "marquee-rtl" : "marquee-ltr" }}
            >
              {settings?.top_bar_content}
            </span>
            <span
              className="marquee-content"
              aria-hidden="true"
              style={{ animationName: isRTL ? "marquee-rtl" : "marquee-ltr" }}
            >
              {settings?.top_bar_content}
            </span>
          </div>
        ) : (
          <span ref={textRef} className="w-full text-center whitespace-nowrap">
            {settings?.top_bar_content}
          </span>
        )}
      </div>

      <style>{`
        .marquee-wrapper {
          display: flex;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-content {
          display: inline-block;
          padding-right: 80px;
          animation-duration: 18s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          flex-shrink: 0;
        }

        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        @keyframes marquee-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TopHeader;
