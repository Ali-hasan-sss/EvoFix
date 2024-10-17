// src/types/types.ts

// واجهة المستخدم
export interface User {
  fullName: string;
  email: string;
  address: string;
  governorate: string;
  phoneNO: string;
}
export interface UserFormInput {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
}
// واجهة تقنية
export interface TechnicianUser {
  fullName: string;
}

export interface Technician {
  user: TechnicianUser;
}

// واجهة طلب الإصلاح
export interface RepairRequest {
  id: number;
  [key: string]: unknown;
  status: string;
  title: string;
  description: string;
  deviceType: string;
  governorate: string;
  cost: number;
  createdAt: string;
  isPaid: boolean;
  problemDescription: string;
  user: User;
  technician?: Technician;
}

// بيانات تسجيل المستخدم العادي
export interface RegisterUserData {
  fullName: string;
  email: string;
  governorate: string;
  password: string;
  confirmPassword: string;
  phoneNO: string;
  address: string;
}

// بيانات نموذج المستخدم
export interface UserFormData {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
}

// الأخطاء في النموذج
export interface FormErrors {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
}

// واجهة بيانات التسجيل الفني
export interface RegisterTechnicianData {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string; // يمكن أن تكون اختيارية إذا لزم الأمر
  services?: string; // يمكن أن تكون اختيارية إذا لزم الأمر
}

// واجهة بيانات تحرير الملف الشخصي
export interface EditProfileData {
  fullName: string;
  email: string;
  governorate: string;
  password: string;
  confirmPassword: string;
  phoneNO: string;
  address: string;
  specialization?: string;
  isActive?: boolean;
  role?: string; // إذا كانت role موجودة
}
