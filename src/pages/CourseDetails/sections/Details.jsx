import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";

import { GoPlay } from "react-icons/go";
import { MdOutlineAccessTime } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { GrCart } from "react-icons/gr";
import { IoFlashOutline } from "react-icons/io5";

const Details = () => {
  const list = [
    {
      id: 1,
      label: "مدة الكورس",
      value: "12 اسبوع",
      icon: <MdOutlineAccessTime size={40} />,
    },
    {
      id: 2,
      label: "عدد المحاضرات",
      value: "40 محاضرة",
      icon: <MdOutlineAccessTime size={40} />,
    },
    {
      id: 3,
      label: "القسم",
      value: "لغة انجليزية",
      icon: <MdOutlineAccessTime size={40} />,
    },
  ];

  return (
    <section className="container sectionPadding grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16">
      <div className="order-2 lg:order-1 space-y-4 content-center">
        <h1 className="text-2xl md:text-3xl font-bold leading-normal">
          اللغة الانجليزية - المستوى الأول
        </h1>

        <p className="lg:text-lg">
          طوّر مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج عملي
          يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل والحياة
          اليومية
        </p>

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden rounded-full">
            <img
              loading="lazy"
              src={userImg}
              alt={""}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-medium">بودا سلطان</h4>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {list.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              {item.icon}
              <div>
                <p className="font-bold">{item.label}</p>
                <span>{item.value}</span>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-lg font-bold">
          السعر: <span className="text-green-600 text-5xl">49 $</span>
        </p>

        <div className="flex items-center gap-2">
          <Button size="lg" className={`rounded-full flex-1`}>
            أضف الى السلة <GrCart />
          </Button>
          <Button size="lg" variant="ghost" className={`rounded-full flex-1`}>
            اشتري الان <IoFlashOutline />
          </Button>
        </div>
      </div>

      <div className="aspect-6/4 rounded-xl overflow-hidden order-1 lg:order-2 relative">
        <img src={image} alt="Hero" className="w-full h-full object-cover" />

        <a
          href="#"
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <GoPlay className="text-[100px] text-white" />
        </a>
      </div>
    </section>
  );
};

export default Details;
