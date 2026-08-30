import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { RiVideoUploadLine } from "react-icons/ri";
import { FiUploadCloud, FiFilm } from "react-icons/fi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/FormError";
import ProfileTitle from "@/components/common/ProfileTitle";
import { addLecture } from "@/api/lectureServices";

// الحد الأقصى لحجم الملف: 2 ميجابايت بالبايت
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const AddLecture = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [fileSizeError, setFileSizeError] = useState("");

  // 👈 State جديدة لتخزين خطأ عدم وجود فيديو أو رابط
  const [videoValidationError, setVideoValidationError] = useState("");

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const lectureSchema = z.object({
    video_url: z
      .string()
      .url(t("addLecture.validation.invalidLink"))
      .or(z.string().optional()),
    title_ar: z.string().min(3, t("addLecture.validation.nameArRequired")),
    title_en: z.string().min(3, t("addLecture.validation.nameEnRequired")),
    description_ar: z
      .string()
      .min(10, t("addLecture.validation.descArRequired")),
    description_en: z
      .string()
      .min(10, t("addLecture.validation.descEnRequired")),
  });

  const {
    handleSubmit,
    control,
    watch, // 👈 لمراقبة التغيير في حقل الرابط لتصفير الخطأ
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

  // مراقبة قيمة الرابط الحالي
  const currentVideoUrl = watch("video_url");

  // 👈 مراقبة المدخلات لتصفير خطأ التحقق فور قيام المستخدم برفع ملف أو إدخال رابط
  useEffect(() => {
    if (videoFile || currentVideoUrl) {
      setVideoValidationError("");
    }
  }, [videoFile, currentVideoUrl]);

  const {
    mutate: createLectureMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (formData) => addLecture(formData, id),
    onSuccess: () => {
      toast.success(t("addLecture.success"));
      setVideoValidationError(""); // تصفير الخطأ عند النجاح
      navigate(`/profile/lectures/${id}`);
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const oversizedFiles = newFiles.filter(
        (file) => file.size > MAX_FILE_SIZE,
      );

      if (oversizedFiles.length > 0) {
        setFileSizeError(t("addLecture.fileTooLarge"));
        return;
      }

      setFileSizeError("");
      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = attachedFiles.filter(
      (_, index) => index !== indexToRemove,
    );
    setAttachedFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      setFileSizeError("");
    }
  };

  const removeVideoFile = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const onSubmit = (data) => {
    if (fileSizeError) return;

    // 👈 التحقق الإجباري: تم الاستبدال بـ State بدلاً من الـ toast.error
    if (!videoFile && !data.video_url) {
      setVideoValidationError(t("addLecture.videoOrLinkRequired"));
      return;
    }

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

    createLectureMutate(formData);
  };

  // =========================================================
  // Errors
  // =========================================================

  const getFirstErrorMessage = (errors) => {
    if (!errors || typeof errors !== "object") return null;

    for (const key of Object.keys(errors)) {
      const error = errors[key];

      // Error مباشر
      if (error?.message) {
        return error.message;
      }

      // Nested errors
      if (typeof error === "object") {
        const nestedError = getFirstErrorMessage(error);

        if (nestedError) {
          return nestedError;
        }
      }
    }

    return null;
  };

  const handleInvalid = (errors) => {
    const firstErrorMessage = getFirstErrorMessage(errors);

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileTitle title={t("addLecture.title")} />

      <form
        onSubmit={handleSubmit(onSubmit, handleInvalid)}
        className="flex flex-col gap-6"
      >
        {/* قسم رفع فيديو المحاضرة */}
        <div className="flex flex-col items-center justify-center mb-4 relative">
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setVideoFile(file);
                setVideoPreview(URL.createObjectURL(file));
              }
            }}
          />

          <div
            onClick={() => videoInputRef.current.click()}
            className={`w-full max-w-xl aspect-2/1 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-6 transition-all text-center relative group overflow-hidden ${
              videoPreview
                ? "bg-emerald-50 border-2 border-emerald-500 dashboard-video-uploaded"
                : "bg-[#F3F4F6] border border-dashed border-gray-300 hover:bg-gray-100"
            }`}
          >
            {videoPreview ? (
              <>
                <button
                  type="button"
                  onClick={removeVideoFile}
                  className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 bg-white rounded-full p-0.5 shadow-md transition-transform hover:scale-110"
                >
                  <IoCloseCircleSharp className="text-2xl" />
                </button>

                <div className="bg-emerald-500 text-white p-4 rounded-xl mb-3">
                  <FiFilm className="text-3xl" />
                </div>
                <span className="text-lg font-bold text-emerald-800 truncate max-w-[90%]">
                  {videoFile?.name}
                </span>
                <span className="text-sm text-emerald-600 mt-1">
                  ({(videoFile?.size / (1024 * 1024)).toFixed(2)} MB){" "}
                  {/* {t("addLecture.readyToUpload")} */}
                  {t("addLecture.videoUploading")}
                </span>
              </>
            ) : (
              <>
                <div className="bg-gray-300/60 p-4 rounded-xl text-gray-700 mb-3">
                  <RiVideoUploadLine className="text-3xl" />
                </div>
                <span className="text-lg font-bold text-[#1A202C]">
                  {t("addLecture.uploadVideo")}
                </span>
              </>
            )}
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
              label={t("addLecture.videoLink")}
              placeholder={t("addLecture.videoLinkPlaceholder")}
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
                label={t("addLecture.nameAr")}
                placeholder={t("addLecture.nameArPlaceholder")}
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
                label={t("addLecture.nameEn")}
                placeholder={t("addLecture.nameEnPlaceholder")}
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
                label={t("addLecture.descAr")}
                placeholder={t("addLecture.descArPlaceholder")}
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
                label={t("addLecture.descEn")}
                placeholder={t("addLecture.descEnPlaceholder")}
                error={errors.description_en?.message}
                type="textarea"
              />
            )}
          />
        </div>

        {/* قسم ملفات المحاضرة المرفقة */}
        <div className="flex flex-col gap-2 w-full max-w-xl mx-auto">
          <label className="text-lg font-medium text-[#1A202C] text-right mb-1">
            {t("addLecture.attachments")}{" "}
            <span className="text-xs text-gray-400">
              {t("addLecture.attachmentNote")}
            </span>
          </label>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full border-2 border-dashed border-sky-600 bg-white hover:bg-sky-600/20 rounded-lg py-5 px-4 cursor-pointer flex items-center justify-center gap-3 transition-all select-none"
          >
            <span className="text-sky-600 font-medium text-base">
              {t("addLecture.uploadFiles")}
            </span>
            <FiUploadCloud className="text-sky-600 text-2xl" />
          </div>

          {fileSizeError && (
            <p className="text-sm font-medium text-red-500 text-right mt-1 animate-pulse">
              {fileSizeError}
            </p>
          )}

          {attachedFiles.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {t("addLecture.selectedFiles", { count: attachedFiles.length })}
              </p>
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                >
                  <span className="text-sm text-gray-700 truncate max-w-[85%] text-left">
                    {file.name}{" "}
                    <span className="text-xs text-gray-400">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center p-1"
                    title={t("addLecture.deleteFile")}
                  >
                    <IoCloseCircleSharp className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* زر الحفظ وقسم عرض الأخطاء بالأسفل */}
        <div className="mt-4 flex flex-col gap-3 items-center justify-center max-w-md mx-auto w-full">
          <Button
            type="submit"
            className="w-full md:w-60 bg-[#1E2229] hover:bg-[#111418] text-white rounded-full py-3"
            disabled={isPending || !!fileSizeError}
          >
            {isPending ? t("addLecture.saving") : t("addLecture.save")}
          </Button>

          {/* 👈 1. مكون الـ FormError الجديد لرسالة رفع فيديو أو لينك */}
          {videoValidationError && (
            <FormError errorMsg={videoValidationError} />
          )}

          {/* 2. مكون الـ FormError الخاص بخطأ السيرفر */}
          {error && (
            <FormError
              errorMsg={error?.response?.data?.message || t("addLecture.error")}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddLecture;
