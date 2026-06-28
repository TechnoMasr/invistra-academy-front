import { useState } from "react";
import Cookies from "js-cookie";

export function useDirectDownload() {
  const [loadingMap, setLoadingMap] = useState({});
  const token = Cookies.get("token");

  const handleDownload = async (url, fileName) => {
    setLoadingMap((prev) => ({ ...prev, [url]: true }));

    try {
      // محاولة fetch أولاً (هتشتغل لو CORS مسموح)
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(url)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName || "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback لو CORS مش مسموح → افتح في tab جديد
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // download attribute مش هيشتغل cross-origin لكن على الأقل بيفتح الملف
      link.download = fileName || "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [url]: false }));
    }
  };

  return { handleDownload, loadingMap };
}
