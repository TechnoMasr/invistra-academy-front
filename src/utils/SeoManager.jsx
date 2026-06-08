import { useEffect } from "react";

const SeoManager = ({ title, description, keywords, canonical, ogImage }) => {
  useEffect(() => {
    // Save old values
    const oldTitle = document.title;
    const oldDesc = document.querySelector("meta[name='description']")?.content;
    const oldKeys = document.querySelector("meta[name='keywords']")?.content;
    const oldCanonical = document.querySelector("link[rel='canonical']")?.href;
    const oldOG = {
      title: document.querySelector("meta[property='og:title']")?.content,
      description: document.querySelector("meta[property='og:description']")
        ?.content,
      image: document.querySelector("meta[property='og:image']")?.content,
      type: document.querySelector("meta[property='og:type']")?.content,
    };

    // Update tags
    document.title = title || "Invistra-Academy";

    const setMeta = (selector, attrName, value, tagName = "meta") => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement(tagName);
        Object.keys(attrName).forEach((k) => tag.setAttribute(k, attrName[k]));
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value || "");
      return tag;
    };

    setMeta("meta[name='description']", { name: "description" }, description);
    setMeta(
      "meta[name='keywords']",
      { name: "keywords" },
      keywords?.join(", "),
    );

    let canonicalTag = document.querySelector("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonical || window.location.href);

    const setOG = (property, content) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content || "");
    };

    setOG("og:title", title || "KMG");
    setOG("og:description", description || "");
    setOG("og:image", ogImage || "");
    setOG("og:type", "website");

    // Cleanup on unmount: restore old values
    return () => {
      document.title = oldTitle || "KMG";

      if (oldDesc !== undefined) {
        document.querySelector("meta[name='description']").content = oldDesc;
      } else {
        document.querySelector("meta[name='description']")?.remove();
      }

      if (oldKeys !== undefined) {
        document.querySelector("meta[name='keywords']").content = oldKeys;
      } else {
        document.querySelector("meta[name='keywords']")?.remove();
      }

      if (oldCanonical !== undefined) {
        document.querySelector("link[rel='canonical']").href = oldCanonical;
      } else {
        document.querySelector("link[rel='canonical']")?.remove();
      }

      // OG cleanup
      const restoreOG = (prop, value) => {
        const tag = document.querySelector(`meta[property='${prop}']`);
        if (!tag) return;

        if (value !== undefined) {
          tag.content = value;
        } else {
          tag.remove();
        }
      };

      restoreOG("og:title", oldOG.title);
      restoreOG("og:description", oldOG.description);
      restoreOG("og:image", oldOG.image);
      restoreOG("og:type", oldOG.type);
    };
  }, [title, description, keywords, canonical, ogImage]);

  return null;
};

export default SeoManager;
