import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiVideoUploadLine } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import {
  getLectureInstructorDetails,
  updateLecture,
} from "@/api/lectureServices";

// الحد الأقصى لحجم الملف: 2 ميجابايت بالبايت
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const EditLecture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // الاحتفاظ بالملفات القديمة، والملفات الجديدة، والملفات المحذوفة
  const [oldFiles, setOldFiles] = useState([]);
  const [deletedOldFiles, setDeletedOldFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // 👈 State جديدة لتخزين خطأ حجم الملفات المرفقة
  const [fileSizeError, setFileSizeError] = useState("");

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const lectureSchema = z.object({
    video_url: z
      .string()
      .url("رابط الفيديو غير صالح")
      .or(z.string().optional()),
    title_ar: z.string().min(3, "عنوان المحاضرة بالعربي مطلوب"),
    title_en: z.string().min(3, "عنوان المحاضرة بالإنجليزي مطلوب"),
    description_ar: z.string().min(10, "وصف المحاضرة بالعربي مطلوب"),
    description_en: z.string().min(10, "وصف المحاضرة بالإنجليزي مطلوب"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      video_url: "",
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
    },
  });

  const { data: lectureData, isLoading } = useQuery({
    queryKey: ["lectureDetails", id],
    queryFn: () => getLectureInstructorDetails(id),
  });

  const formatLectureData = (data) => {
    if (!data) return {};
    return {
      video_url: data.video_url || "",
      title_ar: data.title?.ar || "",
      title_en: data.title?.en || "",
      description_ar: data.description?.ar || "",
      description_en: data.description?.en || "",
    };
  };

  useEffect(() => {
    if (lectureData) {
      reset(formatLectureData(lectureData));
      if (lectureData.video_path) {
        setVideoPreview(lectureData.video_path.split("/").pop());
      }
      if (lectureData.files) {
        setOldFiles(lectureData.files);
      }
    }
  }, [lectureData, reset]);

  const {
    mutate: updateLectureMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (formData) => updateLecture(formData, id),
    onSuccess: () => {
      toast.success("تم تحديث المحاضرة بنجاح");
      setIsEditing(false);
      setAttachedFiles([]);
      setDeletedOldFiles([]);
      setFileSizeError(""); // تصفير الخطأ عند النجاح
      queryClient.invalidateQueries(["lectureDetails", id]);
    },
  });

  // دالة اختيار ملفات جديدة مع عمل فالياديشن للحجم (2MB)
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // فحص حجم الملفات أولاً
      const oversizedFiles = newFiles.filter(
        (file) => file.size > MAX_FILE_SIZE,
      );

      if (oversizedFiles.length > 0) {
        // 👈 تعيين رسالة الخطأ هنا بدلاً من الـ toast
        setFileSizeError(
          "عذراً، بعض الملفات تتجاوز الحد الأقصى المسموح به (2 ميجابايت)",
        );
        return;
      }

      // إذا كانت الملفات سليمة، نظف رسالة الخطأ وأضف الملفات
      setFileSizeError("");
      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // دالة حذف ملف قديم من واجهة المستخدم وتخزينه لإرساله للسيرفر ليحذفه
  const handleRemoveOldFile = (fileUrlToRemove) => {
    setOldFiles((prev) => prev.filter((url) => url !== fileUrlToRemove));
    setDeletedOldFiles((prev) => [...prev, fileUrlToRemove]);
  };

  const removeNewFile = (indexToRemove) => {
    setAttachedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
    // تصفير الخطأ إذا قام المستخدم بحذف الملفات المسببة للمشكلة أو لتنظيف الواجهة
    if (attachedFiles.length <= 1) {
      setFileSizeError("");
    }
  };

  const onSubmit = (data) => {
    // منع الإرسال إذا كان هناك خطأ في حجم الملفات
    if (fileSizeError) return;

    const formData = new FormData();

    formData.append("title[en]", data.title_en);
    formData.append("title[ar]", data.title_ar);
    formData.append("description[en]", data.description_en);
    formData.append("description[ar]", data.description_ar);

    if (data.video_url) {
      formData.append("video_url", data.video_url);
    }

    if (videoFile) {
      formData.append("video_path", videoFile);
    }

    if (attachedFiles.length > 0) {
      attachedFiles.forEach((file) => {
        formData.append("files[]", file);
      });
    }

    if (deletedOldFiles.length > 0) {
      deletedOldFiles.forEach((fileUrl) => {
        formData.append("deleted_files[]", fileUrl);
      });
    }

    updateLectureMutate(formData);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        جاري تحميل بيانات المحاضرة...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <ProfileTitle title="تفاصيل المحاضرة" />

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-medium py-1.5 px-4 text-primary border border-primary rounded-full flex items-center gap-1.5 text-sm hover:bg-primary/5 transition-all"
          >
            <FaRegEdit className="w-4 h-4" />
            <span>تعديل البيانات</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* قسم رفع/تعديل فيديو المحاضرة */}
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            disabled={!isEditing}
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
            onClick={() => isEditing && videoInputRef.current.click()}
            className={`w-full max-w-xl aspect-[2/1] bg-[#F3F4F6] border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-6 transition-all text-center ${
              isEditing
                ? "cursor-pointer hover:bg-gray-100"
                : "cursor-not-allowed opacity-90"
            }`}
          >
            <div className="bg-gray-300/60 p-4 rounded-xl text-gray-700 mb-3">
              <RiVideoUploadLine className="text-3xl" />
            </div>
            <span className="text-lg font-bold text-[#1A202C]">
              {videoPreview ? videoPreview : "فيديو المحاضرة"}
            </span>
          </div>
        </div>

        {/* رابط المحاضرة */}
        <Controller
          name="video_url"
          control={control}
          render={({ field }) => (
            <MainInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              disabled={!isEditing}
              label="رابط المحاضرة"
              placeholder="ادخل رابط المحاضرة.."
              error={errors.video_url?.message}
            />
          )}
        />

        {/* عنوان المحاضرة (عربي وإنجليزي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="title_ar"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
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
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                label="عنوان المحاضرة باللغة الانجليزية"
                placeholder="ادخل عنوان المحاضرة.."
                error={errors.title_en?.message}
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
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                label="وصف المحاضرة باللغة العربية"
                placeholder="أضف وصف للمحاضرة.."
                error={errors.description_ar?.message}
                type="textarea"
              />
            )}
          />
          <Controller
            name="description_en"
            control={control}
            render={({ field }) => (
              <MainInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                label="وصف المحاضرة باللغة الانجليزية"
                placeholder="أضف وصف للمحاضرة.."
                error={errors.description_en?.message}
                type="textarea"
              />
            )}
          />
        </div>

        {/* قسم ملفات المحاضرة المرفقة */}
        <div className="flex flex-col gap-2 w-full max-w-xl mx-auto">
          <label className="text-lg font-medium text-[#1A202C] text-right mb-1">
            ملفات المحاضرة المرفقة{" "}
            <span className="text-xs text-gray-400">
              (الحد الأقصى للملف 2MB)
            </span>
          </label>

          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.pdf"
            ref={fileInputRef}
            disabled={!isEditing}
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={() => isEditing && fileInputRef.current.click()}
            className={`w-full border-2 border-dashed border-sky-600 bg-white rounded-lg py-5 px-4 flex items-center justify-center gap-3 transition-all select-none ${
              isEditing
                ? "cursor-pointer hover:bg-sky-600/10"
                : "cursor-not-allowed opacity-60"
            }`}
          >
            <span className="text-sky-600 font-medium text-base">
              رفع ملفات جديدة
            </span>
            <FiUploadCloud className="text-sky-600 text-2xl" />
          </div>

          {/* 👈 هنا يتم عرض رسالة الخطأ تحت حقل الرفع مباشرة */}
          {fileSizeError && (
            <p className="text-sm font-medium text-red-500 text-right mt-1 animate-pulse">
              {fileSizeError}
            </p>
          )}

          {/* أولاً: عرض الملفات الحالية المرفوعة مسبقاً على السيرفر */}
          {oldFiles.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 bg-gray-100/70 p-3 rounded-xl border border-gray-200/50">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                الملفات الحالية على السيرفر ({oldFiles.length}):
              </p>
              {oldFiles.map((fileUrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                >
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sky-600 hover:underline truncate max-w-[80%] text-left"
                  >
                    {fileUrl.split("/").pop()}
                  </a>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOldFile(fileUrl)}
                      className="text-red-500 hover:text-red-700 transition-colors flex items-center p-1"
                      title="حذف الملف من السيرفر"
                    >
                      <IoCloseCircleSharp className="text-xl" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ثانياً: قائمة الملفات الجديدة التي تم اختيارها الآن ولم تحفظ بعد */}
          {attachedFiles.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-600 mb-1">
                الملفات الجديدة المختارة للحفظ ({attachedFiles.length}):
              </p>
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-200 shadow-sm"
                >
                  <span className="text-sm text-gray-700 truncate max-w-[85%] text-left">
                    {file.name}{" "}
                    <span className="text-xs text-gray-400">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-colors p-1"
                    title="حذف الملف"
                  >
                    <IoCloseCircleSharp className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* أزرار التحكم بالنموذج عند التعديل */}
        {isEditing && (
          <div className="mt-4 flex flex-col md:flex-row gap-3 items-center justify-center border-t pt-4">
            <Button
              type="submit"
              className="w-full md:w-60 bg-[#1E2229] hover:bg-[#111418] text-white rounded-full py-3"
              disabled={isPending || !!fileSizeError} // تعطيل الزر إذا كان هناك خطأ في الحجم
            >
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40 rounded-full py-3"
              onClick={() => {
                reset(formatLectureData(lectureData));
                if (lectureData?.video_path) {
                  setVideoPreview(lectureData.video_path.split("/").pop());
                } else {
                  setVideoPreview(null);
                }
                setVideoFile(null);
                setAttachedFiles([]);
                setDeletedOldFiles([]);
                setFileSizeError(""); // تصفير الخطأ عند الإلغاء
                setIsEditing(false);
              }}
            >
              إلغاء
            </Button>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <FormError
              errorMsg={
                error?.response?.data?.message ||
                "حدث خطأ ما، يرجى المحاولة مرة أخرى"
              }
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default EditLecture;
