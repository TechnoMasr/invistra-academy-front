import SectionTitle from "@/components/common/SectionTitle";
import icon from "@/assets/icons/Icon (1).png";

const StatsSection = () => {
  const list = [
    {
      id: 1,
      title: "المدربين",
      description: "مجموعة متنوعة من الدورات تغطي العديد من المجالات والتخصصات",
      number: "+400,000",
      icon: icon,
    },
    {
      id: 2,
      title: "الطلاب",
      description: "مجموعة متنوعة من الدورات تغطي العديد من المجالات والتخصصات",
      number: "+400,000",
      icon: icon,
    },
    {
      id: 3,
      title: "الدورات",
      description: "مجموعة متنوعة من الدورات تغطي العديد من المجالات والتخصصات",
      number: "+400,000",
      icon: icon,
    },
    {
      id: 4,
      title: "المقالات",
      description: "مجموعة متنوعة من الدورات تغطي العديد من المجالات والتخصصات",
      number: "+1,400,000",
      icon: icon,
    },
  ];

  return (
    <section className="sectionPadding">
      <div className="container">
        <SectionTitle
          title={`إنجازات نفتخر بها`}
          description={`نفخر بالإنجازات التي حققناها مع مجتمعنا التعليمي، حيث تعكس هذه الأرقام مدى التزامنا بتقديم تجربة تعلم متميزة تساعد المتعلمين على تطوير مهاراتهم وتحقيق أهدافهم.`}
        />

        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex flex-col items-center gap-2 text-center border border-primary rounded-lg p-4
              hover:bg-primary hover:text-white transition-all duration-300 ease-in-out group"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-16 h-16 group-hover:invert transition-all duration-300 ease-in-out"
              />
              <h3 className="text-5xl font-semibold">{item.number}</h3>
              <h6 className="text-2xl font-semibold">{item.title}</h6>
              <p className="">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StatsSection;
