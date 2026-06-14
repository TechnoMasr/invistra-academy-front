import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { RiVideoUploadLine } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi"; // استيراد أيقونة الرفع المطابقة للتصميم
import { IoCloseCircleSharp } from "react-icons/io5"; // أيقونة لحذف الملفات
import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";

const AddLecture = () => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // تعديل الـ state لتكون مصفوفة عادية يسهل الحذف منها
  const [attachedFiles, setAttachedFiles] = useState([]);

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. بناء الـ Schema الخاص بالمحاضرة
  const lectureSchema = z.object({
    title_ar: z.string().min(3, "عنوان المحاضرة بالعربي مطلوب"),
    title_en: z.string().min(3, "عنوان المحاضرة بالإنجليزي مطلوب"),
    description_ar: z.string().min(10, "وصف المحاضرة بالعربي مطلوب"),
    description_en: z.string().min(10, "وصف المحاضرة بالإنجليزي مطلوب"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
    },
  });

  // 2. إدارة الـ Mutation لإرسال بيانات المحاضرة
  const {
    mutate: createLectureMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      console.log("FormData to send: ", formData);
      // هنا مسار الـ API الخاص بك
    },
    onSuccess: () => {
      // التوجيه أو رسالة نجاح
    },
  });

  // دالة التعامل مع اختيار ملفات متعددة وتجنب التكرار
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // دالة لحذف ملف معين من القائمة
  const removeFile = (indexToRemove) => {
    setAttachedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // إضافة الحقول النصية
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // إضافة فيديو المحاضرة
    if (videoFile) {
      formData.append("lecture_video", videoFile);
    }

    // إضافة ملفات المحاضرة المرفقة إن وجدت
    if (attachedFiles.length > 0) {
      attachedFiles.forEach((file) => {
        formData.append("lecture_files", file);
      });
    }

    createLectureMutate(formData);
  };

  return (
    <div className="space-y-6">
      <ProfileTitle title="إضافة محاضرة" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* قسم رفع فيديو المحاضرة (الكبير في المنتصف) */}
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setVideoFile(file);
                setVideoPreview(file.name);
              }
            }}
          />

          <div
            onClick={() => videoInputRef.current.click()}
            className="w-full max-w-xl aspect-[2/1] bg-[#F3F4F6] border border-dashed border-gray-300 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-6 hover:bg-gray-100 transition-all text-center"
          >
            <div className="bg-gray-300/60 p-4 rounded-xl text-gray-700 mb-3">
              <RiVideoUploadLine className="text-3xl" />
            </div>
            <span className="text-lg font-bold text-[#1A202C]">
              {videoPreview ? videoPreview : "رفع فيديو المحاضرة"}
            </span>
          </div>
        </div>

        {/* عنوان المحاضرة (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="title_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="عنوان المحاضرة باللغة العربية"
                placeholder="ادخل عنوان المحاضرة.."
                error={errors.title_ar?.message}
              />
            )}
          />
          <Controller
            name="title_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="عنوان المحاضرة باللغة الانجليزية"
                placeholder="ادخل عنوان المحاضرة.."
                error={errors.title_en?.message}
                dir="ltr"
              />
            )}
          />
        </div>

        {/* وصف المحاضرة (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="description_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="وصف المحاضرة باللغة العربية"
                placeholder="أضف وصف للمحاضرة.."
                error={errors.description_ar?.message}
                isTextArea
              />
            )}
          />
          <Controller
            name="description_en"
            control={control}
            render={({ field }) => (
              <MainInput
                {...field}
                label="وصف المحاضرة باللغة الانجليزية"
                placeholder="أضف وصف للمحاضرة.."
                error={errors.description_en?.message}
                isTextArea
                dir="ltr"
              />
            )}
          />
        </div>

        {/* قسم ملفات المحاضرة المرفقة المحدث تماماً حسب التصميم */}
        <div className="flex flex-col gap-2 w-full max-w-xl mx-auto">
          <label className="text-lg font-medium text-[#1A202C] text-right mb-1">
            ملفات المحاضرة
          </label>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* صندوق الرفع المطابق للتصميم المرفق */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full border-2 border-dashed border-sky-600 bg-white hover:bg-sky-600/20 rounded-lg py-5 px-4 cursor-pointer flex items-center justify-center gap-3 transition-all select-none"
          >
            <span className="text-sky-600 font-medium text-base">
              رفع ملفات المحاضرة
            </span>
            <FiUploadCloud className="text-sky-600 text-2xl" />
          </div>

          {/* قائمة الملفات المختارة مع إمكانية حذفها */}
          {attachedFiles.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                الملفات المختارة ({attachedFiles.length}):
              </p>
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                >
                  <span
                    className="text-sm text-gray-700 truncate max-w-[85%] text-left"
                    dir="ltr"
                  >
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center p-1"
                    title="حذف الملف"
                  >
                    <IoCloseCircleSharp className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* زر الحفظ */}
        <div className="mt-4 flex flex-col gap-3 items-center">
          <Button
            type="submit"
            className="w-full md:w-60 bg-[#1E2229] hover:bg-[#111418] text-white rounded-full py-3"
            disabled={isPending}
          >
            {isPending ? "جاري الحفظ..." : "حفظ"}
          </Button>

          {error && (
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                "حدث خطأ ما، يرجى المحاولة مرة أخرى"
              }
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddLecture;
