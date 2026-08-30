import { Address } from "cluster";

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  paymentMethod?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'mobile_money' | 'bank_transfer' | 'wallet';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Card specific
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    country: string;
  };
  // Mobile Money specific
  mobileMoney?: {
    phone: string;
    provider: 'orange' | 'wave' | 'free' | 'expresso';
    accountName?: string;
  };
  // Bank Transfer specific
  bankTransfer?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
    iban?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: 'completed' | 'failed' | 'pending' | 'processing';
  message: string;
  transactionId?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface MobileMoneyPayment {
  phone: string;
  provider: 'orange' | 'wave' | 'free' | 'expresso';
  amount: number;
  currency: string;
  reference?: string;
  description?: string;
}

export interface MobileMoneyPaymentResult {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  code?: string;
}

export interface BankTransferPayment {
  accountId: string;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  iban?: string;
  reference: string;
  amount: number;
  currency: string;
  instructions: string;
  expiresAt: Date;
}

export interface CardPayment {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  name: string;
  email?: string;
  billingAddress?: Address;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'canceled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
  currency: string;
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  intervalCount: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency?: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  eligibleUsers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  paymentId: string;
  amount: number;
  currency: string;
  type: 'charge' | 'refund' | 'capture' | 'authorization';
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  balance: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentWebhook {
  id: string;
  event: string;
  data: Record<string, any>;
  livemode: boolean;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
}