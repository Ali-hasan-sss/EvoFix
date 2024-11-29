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
export interface RequestStats {
  unreadNotifications: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  rejectedRequests: number;
}

export interface Technician extends User {
  isActive: boolean;
  technician?: {
    displayId?: 123; // يجب تحديد القيمة
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
  admin_governorate?: string;
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
  admin_governorate?: string;
  department?: string;
}
//انشات نوع بيانات مشترك من اجل استخدامه في صفحة اليوزر الديناميكية
export type CombinedUserFormInput = EditProfileData & UserFormInput;

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
  admin_governorate?: string;
}

// واجهة بيانات التسجيل الفني
// واجهة بيانات تسجيل الفني
export interface RegisterTechnicianData {
  email: string;
  fullName: string;
  governorate: string;
  password: string; // تأكد من أن هذا هو نوع 'string'
  confirmPassword: string; // تأكد من أن هذه الخاصية موجودة
  phoneNO: string;
  address: string;
  specialization?: string;
  services?: string;
  role?: string;
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
// User interface defining the structure of user data
export interface UserForADMIN {
  displayId: number;
  id: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}

// Interface for the data used in the user form
export interface UserFormDataForADMIN {
  fullName: string;
  phoneNO: string;
  email: string;
  governorate: string;
  address: string;
  role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
  specialization?: string;
  services?: string;
}
export type EditProfileData = Omit<UserFormInput, "password"> & {
  password?: string; // ستكون اختيارية هنا فقط
};
export interface APINotification {
  id: number;
  recipientId: number;
  senderId: number;
  requestId: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  request?: {
    isPaid: boolean;
    isPaidCheckFee: boolean;
    status: string;
    rejected: boolean;
  };
}

export interface MappedNotification extends APINotification {
  request?: {
    isPaid: boolean;
    isPaidCheckFee: boolean;
    status: string;
    rejected: boolean;
  };
}
// Define the types for contact messages and FAQs
export interface ContactMessage {
  id: number;
  content: string;
  email: string;
  subject: string;
  sentAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  isPublished: boolean;
}
export interface Review {
  id: number;
  rating: number;
  comment: string;
  isActive: boolean;
  user: {
    fullName: string;
    email: string;
    phoneNO: string;
  };
}
export interface Invoice {
  amount: number;
  issueDate: string;
  dueDate: string;
  isPaid: boolean;
  paidAt?: string | null;
  user: {
    fullName: string;
  };
  request: {
    deviceType: string;
    deviceModel: string;
    problemDescription: string;
    isPaidCheckFee: boolean;
    governorate: string;
    Epaid: {
      CheckFee: number;
    }[];
  };
}
