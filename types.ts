
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST'
}

export enum OrderCategory {
  BRIDAL = 'Bridal Designs',
  KIDS = 'Kids Designs',
  BLOUSE = 'Blouse Designs',
  SAREE_BORDER = 'Saree Border Designs',
  NAME_EMBROIDERY = 'Name Embroidery',
  CUSTOM = 'Custom Orders'
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELIVERED = 'Delivered'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  FAILED = 'Failed',
  COD_PENDING = 'COD Pending',
  COD_COMPLETED = 'COD Completed'
}

export interface Design {
  id: string;
  title: string;
  category: OrderCategory;
  price: number;
  images: string[];
  description: string;
}

export interface User {
  id: string;
  employeeId?: string; // 6-digit login ID for employees
  name: string;
  role: UserRole;
  phone?: string;
  assignedOrders?: string[]; // IDs
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAdmin: boolean; // or isEmployee
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: OrderCategory;
  description: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  dueDate: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pinCode: string;
  };
  totalAmount: number;
  assignedEmployeeId?: string;
  referenceImages?: string[];
  designId?: string;
  messages: ChatMessage[];
  qrCodeUrl?: string; // Admin uploads this
  paymentProofUrl?: string; // Customer uploads this
  isCOD: boolean;
  generatedDesignUrl?: string; // If AI generated
}

export interface Offer {
  id: string;
  text: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
