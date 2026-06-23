import { useState } from "react";

export function useDirectDownload() {
  const [loadingMap, setLoadingMap] = useState({});

  const handleDownload = async (url, fileName) => {
    setLoadingMap((prev) => ({ ...prev, [url]: true }));
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName || "file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [url]: false }));
    }
  };

  return { handleDownload, loadingMap };
}
