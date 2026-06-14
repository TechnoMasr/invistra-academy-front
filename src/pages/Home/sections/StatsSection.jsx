import SectionTitle from "@/components/common/SectionTitle";

const StatsSection = ({ data = {}, loading }) => {
  const list = [
    {
      id: 1,
      title: data?.instructors_count_title,
      description: data?.instructors_count_description,
      number: data?.instructors_count,
      icon: data?.instructors_count_icon,
    },
    {
      id: 2,
      title: data?.courses_count_title,
      description: data?.courses_count_description,
      number: data?.courses_count,
      icon: data?.courses_count_icon,
    },
    {
      id: 3,
      title: data?.exams_count_title,
      description: data?.exams_count_description,
      number: data?.exams_count,
      icon: data?.exams_count_icon,
    },
    {
      id: 4,
      title: data?.certificates_count_title,
      description: data?.certificates_count_description,
      number: data?.certificates_count,
      icon: data?.certificates_count_icon,
    },
  ];

  return (
    <section className="sectionPadding">
      <div className="container">
        <SectionTitle title={data?.title} description={data?.description} />

        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex flex-col items-center gap-2 text-center border border-primary rounded-lg p-4
              hover:bg-primary hover:text-white transition-all duration-300 ease-in-out group"
            >
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 group-hover:invert transition-all duration-300 ease-in-out"
                />
              )}
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
