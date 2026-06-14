import { FiDownloadCloud } from "react-icons/fi";
import { Button } from "../ui/button";
import { SlLayers } from "react-icons/sl";
import { ImLinkedin } from "react-icons/im";

const CertificatesCard = ({ item }) => {
  return (
    <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="w-full aspect-5/3 overflow-hidden rounded-md">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold line-clamp-2">{item.title}</h3>

        <p className="flex items-center gap-1 font-semibold">
          <SlLayers />
          قسم اللغة انجليزية
        </p>

        <div className="flex items-center gap-2">
          <div className="w-8 aspect-square overflow-hidden rounded-full">
            <img
              loading="lazy"
              src={item.teacher.image}
              alt={item.teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-medium">{item.teacher.name}</h4>
        </div>

        <Button>
          تحميل الشهادة <FiDownloadCloud />
        </Button>
        <Button variant="outline">
          مشاركة في لينكدإن
          <ImLinkedin className="w-5 h-5 text-[#0077B5]" />
        </Button>
      </div>
    </div>
  );
};

export default CertificatesCard;
