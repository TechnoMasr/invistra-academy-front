import video from "@/assets/images/video.mp4";
import { FaRegFolderOpen } from "react-icons/fa";
import { FiDownloadCloud } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa6";

const LectureDetails = () => {
  const files = Array(8).fill({
    title: "ملخص شرح المحاضرة الأولى",
    size: "PDF 3.4MB",
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-md">
          <video
            src={video}
            controls
            className="w-full h-full object-cover"
            poster=""
          >
            متصفحك لا يدعم تشغيل هذا الفيديو.
          </video>
        </div>

        <div className="border rounded-2xl p-4">
          <h1 className="text-2xl lg:text-3xl font-bold flex items-start gap-1 mb-3">
            <span className="text-white bg-primary rounded-full w-8 h-8 flex items-center justify-center mt-1">
              1
            </span>{" "}
            مقدمة في اللغة الإنجليزية
          </h1>

          <p className="text-sm opacity-90 leading-relaxed">
            طور مهاراتك في القراءة والكتابة والاستماع والمحادثة من خلال منهج
            عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في الدراسة والعمل
            والحياة اليومية طور مهاراتك في القراءة والكتابة والاستماع والمحادثة
            من خلال منهج عملي يساعدك على استخدام اللغة الإنجليزية بطلاقة في
            الدراسة والعمل والحياة اليومية طور مهاراتك في القراءة والكتابة
            والاستماع والمحادثة من خلال منهج عملي يساعدك على استخدام اللغة
            الإنجليزية بطلاقة في الدراسة والعمل والحياة اليومية من خلال منهج
            عملي يساعدك والـ...
          </p>
        </div>
      </div>

      <div className="border rounded-2xl p-4 h-fit">
        <div className="flex items-start gap-2 mb-1">
          <FaRegFolderOpen className="text-xl mt-1" />
          <h2 className="text-lg font-bold">ملفات ومرفقات المحاضرة</h2>
        </div>
        <p className="opacity-80 text-sm mb-4">
          يمكنك تحميل الملخصات والملفات التعليمية المعتمدة لهذه المحاضرة
          للمذاكرة لاحقاً.
        </p>

        <div className="space-y-3 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-400 p-2 rounded-lg flex flex-col items-center justify-center min-w-[40px]">
                  <FaFilePdf className="text-2xl" />
                </div>

                <div>
                  <h4 className="font-medium text-sm">{file.title}</h4>
                  <span className="text-xs opacity-70 block font-mono">
                    {file.size}
                  </span>
                </div>
              </div>

              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                <FiDownloadCloud className="text-base" />
                <span>تحميل</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureDetails;
