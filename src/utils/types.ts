// src/types/types.ts

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  isActive?: boolean;
  address: string;
  governorate: string;
  role: string;
  [key: string]: unknown;
}

export interface UserFormInput {
  fullName: string;
  email: string;
  phoneNO: string;
  role?: string;
  isActive?: boolean;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
}

export interface Technician extends User {
  isActive: boolean;
  technician?: {
    services?: string;
    specialization?: string;
  };
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
  user: {
    fullName: string;
    phoneNO: string;
    address: string;
  };
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
export interface Service {
  id: number;
  title: string;
  description: string;
  serviceImage: string;
}
export interface DeviceModel {
  id: number;
  title: string;
  serviceID: number;
  createAt: string;
  isActive?: boolean;
  services: Service[];
}
