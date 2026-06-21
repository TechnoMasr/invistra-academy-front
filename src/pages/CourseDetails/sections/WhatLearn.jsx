import { useTranslation } from "react-i18next";

const WhatLearn = ({ data }) => {
  const { t } = useTranslation();
  if (!data || !data?.length) return null;
  return (
    <section className="container sectionPadding">
      <h1 className="text-2xl md:text-3xl font-bold leading-normal mb-6">
        {t("whatLearn.title")}
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1 border border-primary rounded-lg p-3"
          >
            <p className="font-bold">{item.title}</p>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatLearn;
