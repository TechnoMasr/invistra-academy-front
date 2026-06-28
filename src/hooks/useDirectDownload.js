import { useState } from "react";

export function useDirectDownload() {
  const [loadingMap, setLoadingMap] = useState({});

  const handleDownload = async (url, fileName) => {
    setLoadingMap((prev) => ({ ...prev, [url]: true }));

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName || "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      window.open(url, "_blank");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [url]: false }));
    }
  };

  return { handleDownload, loadingMap };
}
