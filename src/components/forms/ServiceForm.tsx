import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "@/app/ThemeContext";
interface ServiceFormProps {
  initialData?: {
    title: string;
    description: string;
    serviceImage?: File | null; // تعديل هنا
  };
  onSubmit: (data: {
    title: string;
    description: string;
    serviceImage: File | null; // تعديل هنا
  }) => void;
  onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [serviceImage, setServiceImage] = useState<File | null>(
    initialData?.serviceImage || null
  );
  const [preview, setPreview] = useState<string | null>(null); // حالة المعاينة
  const { isDarkMode } = useContext(ThemeContext);
  useEffect(() => {
    // تحديث رابط المعاينة عند تغيير الصورة
    if (serviceImage) {
      const imagePreviewUrl = URL.createObjectURL(serviceImage);
      setPreview(imagePreviewUrl);

      // تنظيف الرابط عند مغادرة المكون
      return () => URL.revokeObjectURL(imagePreviewUrl);
    } else {
      setPreview(null); // إذا لم يكن هناك صورة
    }
  }, [serviceImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setServiceImage(event.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setServiceImage(null); // إزالة الصورة
    setPreview(null); // إعادة تعيين رابط المعاينة
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ title, description, serviceImage });
  };

  return (
    <div
      className={`p-4 rounded shadow-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">
        {initialData ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className={`p-2 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">عنوان الخدمة</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full border rounded p-2 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
            }`}
            placeholder="أدخل عنوان الخدمة"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">وصف الخدمة</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={`w-full border rounded p-2 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
            }`}
            placeholder="أدخل وصف الخدمة"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">صورة الخدمة</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {preview && ( // عرض المعاينة إذا كانت موجودة
            <div className="mt-4">
              <Image
                src={preview}
                alt="معاينة الصورة"
                width={200}
                height={200} // يمكنك تحديد الارتفاع أيضًا
                className="h-auto rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage} // زر إزالة الصورة
                className="mt-2 bg-red-500 text-white rounded px-4 py-2"
              >
                إزالة الصورة
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-400 text-gray-700 rounded px-4 py-2"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {initialData ? "حفظ " : "إضافة الخدمة"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
