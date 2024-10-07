// في صفحة UnauthorizedPage
import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </h1>
        <p className="text-lg mb-4">
          يرجى التحقق من صلاحياتك أو تسجيل الدخول بحساب آخر.
        </p>
        <Link href="/" className="text-blue-500 hover:underline">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
