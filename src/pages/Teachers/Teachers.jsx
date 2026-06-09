import image from "@/assets/images/auth-bg.png";
import TeacherCard from "@/components/cards/TeacherCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHead from "@/components/common/PageHead";
import MainPagination from "@/components/common/MainPagination";

const Teachers = () => {
  const list = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    image: image,
    name: "بودا سلطان",
    jop: "خبير اللغة الإنجليزية",
    category: "قسم اللغة انجليزية",
    slug: "بودا-سلطان",
  }));

  return (
    <main>
      <PageHead
        title="خبراء يقودون رحلتك التعليمية"
        description="تعلّم على يد محاضرين ذوي خبرات أكاديمية ومهنية متنوعة، ملتزمين بتقديم تجربة تعليمية متميزة"
      />

      <section className="container pagePadding space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((item) => (
            <TeacherCard key={item.id} teacher={item} />
          ))}
        </div>

        <MainPagination
          totalPages={10}
          currentPage={1}
          onPageChange={() => {}}
        />
      </section>
    </main>
  );
};

export default Teachers;
