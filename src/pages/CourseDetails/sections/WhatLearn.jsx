import icon from "@/assets/icons/Icon (1).png";

const WhatLearn = () => {
  const list = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    label: "تأسيس النحو والإعراب",
    value:
      "فهم قواعد الإعراب من البداية وحتى أدق التفاصيل وتطبيقها على آيات القرآن الكريم والشعر الفصيح.",
    icon: icon,
  }));

  return (
    <section className="container sectionPadding">
      <h1 className="text-2xl md:text-3xl font-bold leading-normal mb-6">
        ماذا ستتعلم في الكورس؟
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((item) => (
          <li
            key={item.id}
            className="flex gap-2 border border-primary rounded-lg p-3"
          >
            <div className="w-8 h-8 overflow-hidden">
              <img
                src={item.icon}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">{item.label}</p>
              <p>{item.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatLearn;
