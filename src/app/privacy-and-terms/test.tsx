"use client";
import React, { useContext, Suspense } from "react";
import Navbar from "@/components/navBar";
import { ThemeContext } from "../context/ThemeContext";

const PrivacyAndTerms: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div
        className={` mx-auto mt-20 px-4 py-8 text-right
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"}`}
        style={{ minHeight: "100vh", marginTop: "75px" }}
      >
        <h1 className="text-3xl text-center font-bold mb-4">
          سياسة الخصوصية وشروط الاستخدام
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">سياسة الخصوصية</h2>
          <p className="mb-4">
            تحترم منصة EVOFIX خصوصيتك وتهتم بحماية بياناتك. سيتم جمع واستخدام
            بياناتك فقط لتحسين تجربتك على المنصة ولتقديم خدماتنا بشكل أفضل.
            المعلومات التي يتم جمعها تشمل البيانات الأساسية مثل الاسم، عنوان
            البريد الإلكتروني، ومعلومات الاتصال.
          </p>
          <p className="mb-4">
            نحن نستخدم البيانات التي تقدمها لتسهيل عملية طلب الإصلاح، وضمان
            التواصل الفعال بينك وبين مقدمي خدمات الإصلاح. كما قد يتم استخدام
            بياناتك لتحسين أداء الموقع وتحليل السلوك العام للمستخدمين.
          </p>
          <p className="mb-4">
            لن نقوم بمشاركة بياناتك الشخصية مع أي طرف ثالث بدون موافقتك المسبقة،
            إلا إذا كان ذلك مطلوباً بموجب القانون.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">شروط الاستخدام</h2>
          <p className="mb-4">
            عند استخدامك لمنصة EVOFIX، فإنك توافق على الالتزام بجميع الشروط
            والأحكام الواردة هنا. يتم تقديم خدماتنا لأغراض شخصية وغير تجارية
            فقط، ويجب أن تكون جميع المعلومات التي تقدمها دقيقة وصحيحة.
          </p>
          <p className="mb-4">
            يُحظر استخدام المنصة لأي أغراض غير قانونية أو غير أخلاقية. كما يجب
            الالتزام بعدم إساءة استخدام المنصة أو نشر محتوى مضلل أو مضر أو محتوى
            ينتهك حقوق الملكية الفكرية للآخرين.
          </p>
          <p className="mb-4">
            تحتفظ المنصة بحقها في تعديل أو إيقاف الخدمات أو المحتوى دون إشعار
            مسبق. كما قد يتم تحديث شروط الاستخدام وسياسة الخصوصية بين الحين
            والآخر، لذا ننصحك بمراجعتها بانتظام.
          </p>
          <p className="mb-4">
            يعتبر استخدامك المستمر للمنصة بعد إجراء أي تغييرات على هذه الشروط
            موافقةً منك على هذه التغييرات.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">اتصل بنا</h2>
          <p>
            إذا كان لديك أي استفسارات حول سياسة الخصوصية أو شروط الاستخدام، لا
            تتردد في التواصل معنا من خلال قسم الدعم في الموقع.
          </p>
        </section>
        <a href="/" className="text-blue-500 m-0 -p-0">
          العودة الى الصفحة الرئيسية
        </a>
      </div>
    </Suspense>
  );
};

export default PrivacyAndTerms;
