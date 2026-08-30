export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  DELIVERY = 'delivery',
  ADVISOR = 'advisor',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  userId: string;
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  marketing: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location?: {
    country: string;
    city: string;
  };
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh: string;
  expiresIn: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
  preferences?: Partial<UserPreferences>;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  uid: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  totalOrders: number;
  totalSpent: number;
  totalReviews: number;
  totalWishlist: number;
  averageRating: number;
  lastOrderDate?: Date;
  memberSince: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'order' | 'review' | 'wishlist' | 'cart' | 'payment';
  data: Record<string, any>;
  ip: string;
  userAgent: string;
  createdAt: Date;
}

export interface UserWishlist {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    image: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSearchHistory {
  id: string;
  userId: string;
  query: string;
  resultsCount: number;
  createdAt: Date;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'order' | 'delivery' | 'promotion' | 'system' | 'support';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  image?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  dateJoinedStart?: Date;
  dateJoinedEnd?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'lastLogin' | 'totalOrders' | 'totalSpent';
  sortOrder?: 'asc' | 'desc';
}