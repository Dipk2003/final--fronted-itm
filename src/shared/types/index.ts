// =============================================================================
// Indian Trade Mart - Complete Type Definitions
// =============================================================================

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'vendor';
  roles: string[];
  isVerified: boolean;
  phone?: string;
  address?: string;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'user' | 'admin' | 'vendor';
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  userType: 'user' | 'admin' | 'vendor';
  companyName?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: number;
  subCategoryId?: number;
  vendorId: number;
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDto extends Product {
  brand?: string;
  model?: string;
  sku?: string;
  originalPrice?: number;
  stock?: number;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDto extends Category {}

export interface SubCategory extends Category {
  categoryId: number;
}

export interface MicroCategory extends Category {
  subCategoryId: number;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  notes?: string;
}

// Address Types
export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

// Inquiry Types
export interface Inquiry {
  id: string;
  productId: number;
  userId: string;
  vendorId: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryDto extends Inquiry {}

export interface CreateInquiryDto {
  productId: number;
  subject: string;
  message: string;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  dateFrom?: string;
  dateTo?: string;
}

export enum InquiryStatus {
  OPEN = 'OPEN',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED'
}

// Quote Types
export interface Quote {
  id: string;
  inquiryId: string;
  vendorId: string;
  buyerId: string;
  price: number;
  quantity: number;
  validUntil: string;
  terms: string;
  status: QuoteStatus;
  createdAt: string;
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// Support Types
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  user: User;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
}

// Chat Types
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessageDto extends ChatMessage {}

export interface LiveChatSession {
  id: string;
  participants: string[];
  status: 'active' | 'closed';
  createdAt: string;
}

export interface CreateConversationDto {
  participantId: string;
  message: string;
}

export interface SendMessageDto {
  message: string;
  attachments?: File[];
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: Product;
  createdAt: string;
}

// Vendor Types
export interface Vendor {
  id: string;
  userId: string;
  companyName: string;
  gstNumber?: string;
  businessType: string;
  isVerified: boolean;
  rating: number;
  totalOrders: number;
  joinedAt: string;
}

// KYC Types
export interface KycDocument {
  id: string;
  userId: string;
  documentType: KycDocumentType;
  documentNumber: string;
  documentUrl: string;
  status: KycStatus;
  uploadedAt: string;
}

export enum KycDocumentType {
  PAN = 'PAN',
  AADHAR = 'AADHAR',
  GST = 'GST',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE'
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Analytics Types
export interface DashboardAnalytics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

// Payment Types
export interface PaymentOrder {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentId?: string;
  createdAt: string;
}

export interface CreatePaymentOrderDto {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Search Types
export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  rating?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequestDto) => Promise<void>;
}

// Redux Types
export interface RootState {
  auth: AuthState;
  cart: CartState;
  products: ProductState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Export default interface for backward compatibility
export default interface Types {
  User: User;
  Product: Product;
  Order: Order;
  Inquiry: Inquiry;
  Quote: Quote;
}
