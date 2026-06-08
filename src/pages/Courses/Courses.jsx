import image from "@/assets/images/auth-bg.png";
import userImg from "@/assets/icons/Icon (1).png";
import CourseCard from "@/components/cards/CourseCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Courses = () => {
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

  return (
    <main>
      <section className="container pagePadding space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium inline-block mb-2">
              القسم
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="item1">item1</SelectItem>
                  <SelectItem value="item2">item2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium inline-block mb-2">
              المحاضر
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المحاضر" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="item1">item1</SelectItem>
                  <SelectItem value="item2">item2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Courses;
