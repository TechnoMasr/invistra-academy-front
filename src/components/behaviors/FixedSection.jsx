import { useSelector } from "react-redux";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import { useTranslation } from "react-i18next";

const FixedSection = () => {
  const { settings } = useSelector((state) => state.settings);
  const { t } = useTranslation();

  const list = [
    {
      id: 1,
      title: t("phone"),
      link: `tel:${(settings?.contact?.phone || "").replace(/\s/g, "")}`,
      icon: <MdLocalPhone />,
      color: "#215274",
      value: settings?.contact?.phone,
    },
    {
      id: 2,
      title: t("whatsapp"),
      link: `https://wa.me/${(settings?.social?.whatsapp || "").replace(
        /\s/g,
        "",
      )}`,
      icon: <FaWhatsapp />,
      color: "#25D366",
      value: settings?.social?.whatsapp,
    },
  ];

  return (
    <section className="fixed inset-e-0 bottom-1/6 z-40">
      <div className="flex flex-col items-end gap-2">
        {list
          .filter((item) => item.value)
          .map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              style={{ backgroundColor: `${item.color}` }}
              className="p-1 ps-2 shadow-md shadow-myGold/20 rounded-s-full flex items-center gap-1 group"
            >
              <span className="text-3xl">{item.icon}</span>

              <p className="lg:text-base text-center font-semibold font-sans capitalize w-0 group-hover:w-20 transition-all ease-in-out duration-500 overflow-hidden">
                {item.title}
              </p>
            </a>
          ))}
      </div>
    </section>
  );
};

export default FixedSection;
