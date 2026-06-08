import SectionTitle from "@/components/common/SectionTitle";
import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import { useState } from "react";
import CourseCard from "@/components/cards/CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const CoursesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "اللغة الانجليزية - المستوى الأول",
    description:
      "طوّر مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل والحياة اليومية",
    image: image,
    price: 50,
    lecture_number: 12,
    teacher: {
      name: "بودا سلطان",
      image: userImg,
    },
  }));

  const categories = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: "لغة عربية",
  }));

  return (
    <section className="sectionPadding relative">
      <div className="absolute inset-0 rounded-3xl opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[86px_86px] z-0"></div>

      <div className="container relative z-10">
        <SectionTitle
          title={`مجالات متنوعة.. فرص تعلم بلا حدود`}
          description={`استكشف الدورات التعليمية في مختلف التخصصات وابدأ رحلة تطوير مهاراتك مع نخبة من الخبراء والمحاضرين.`}
        />

        <ul className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`px-4 py-2 rounded-full cursor-pointer bg-white border hover:bg-primary hover:text-white transition duration-300 ease-in-out ${
                selectedCategory === category.id ? "bg-primary! text-white" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link to="/courses" className="rounded-full">
            <Button className="px-6">المزيد من الكورسات</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
