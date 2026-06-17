import ProfileTitle from "@/components/common/ProfileTitle";
import { HelpCircle } from "lucide-react"; // أو أي مكتبة أيقونات تستخدمها

// بيانات تجريبية تحاكي الموجود في الصورة image_2c731b.png
const mockQuestions = [
  {
    id: 1,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 1,
  },
  {
    id: 2,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 2,
  },
  {
    id: 3,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 1,
  },
  {
    id: 4,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 3,
  },
  {
    id: 5,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 0,
  },
  {
    id: 6,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "wrong",
    selectedIndex: 2,
    correctIndex: 1,
  },
  {
    id: 7,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 3,
  },
  {
    id: 8,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "wrong",
    selectedIndex: 1,
    correctIndex: 0,
  },
  {
    id: 9,
    text: "She ____ to school every day.",
    options: ["go", "go", "go", "go"],
    status: "correct",
    selectedIndex: 2,
  },
  {
    id: 10,
    text: "I ____ my homework yesterday.",
    options: ["go", "go", "go", "go"],
    status: "wrong",
    selectedIndex: 0,
    correctIndex: 3,
  },
];

const MyExamDetails = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileTitle title="اختبار تقييم مستوى اللغة الانجليزية" />

        <p className="font-medium py-1 px-4 text-red-500 border border-red-300 bg-red-50/50 rounded-full flex items-center gap-1.5 text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>10 أسئلة</span>
        </p>
      </div>

      {/* محتوى الأسئلة */}
      <div className="space-y-6">
        {" "}
        {/* الأسئلة بالإنجليزية فتكون اليسار لليمين */}
        <h3 className="text-gray-800 font-bold text-lg mb-4">
          Choose the correct answer:
        </h3>
        <div className="space-y-4">
          {mockQuestions.map((q) => (
            <div key={q.id} className="space-y-2">
              {/* نص السؤال */}
              <p className="text-gray-900 font-medium text-base">
                {q.id}- {q.text}
              </p>

              {/* الخيارات الأربعة موزعة بشكل أفقي */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {q.options.map((option, index) => {
                  // تحديد ستايل الخيار بناءً على حالته في الصورة
                  let optionStyle = "border-gray-300 bg-white text-gray-700";
                  let radioStyle = "border-gray-400";

                  if (q.status === "correct" && index === q.selectedIndex) {
                    // الإجابة الصحيحة المحددة (الأخضر)
                    optionStyle =
                      "border-green-400 bg-green-50 text-green-700 font-semibold";
                    radioStyle = "border-green-600 bg-green-600 text-white";
                  } else if (
                    q.status === "wrong" &&
                    index === q.selectedIndex
                  ) {
                    // الإجابة الخاطئة التي اختارها المستخدم (الأحمر)
                    optionStyle =
                      "border-red-400 bg-red-100 text-red-700 font-semibold";
                    radioStyle = "border-red-600 bg-red-600 text-white";
                  } else if (q.status === "wrong" && index === q.correctIndex) {
                    // الإجابة الصحيحة التي كان يجب اختيارها (الأخضر)
                    optionStyle =
                      "border-green-400 bg-green-50 text-green-700 font-semibold";
                    radioStyle = "border-green-600 bg-green-600 text-white";
                  }

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 border rounded-lg p-2.5 text-sm transition-all ${optionStyle}`}
                    >
                      {/* محاكاة شكل أزرار الراديو المدعومة في التصميم */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${radioStyle}`}
                      >
                        {(index === q.selectedIndex ||
                          (q.status === "wrong" && index === q.correctIndex)) &&
                          "●"}
                      </span>
                      <span>{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyExamDetails;
