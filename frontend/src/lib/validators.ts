import { z } from 'zod';

// ============ AUTH VALIDATORS ============

export const LoginSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .min(1, 'L\'email est requis'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe est trop long'),
});

export const RegisterSchema = z.object({
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(50, 'Le nom d\'utilisateur est trop long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  email: z.string()
    .email('Email invalide')
    .min(1, 'L\'email est requis'),
  phone: z.string()
    .regex(/^(\+?[0-9]{1,3})?[0-9]{9,12}$/, 'Numéro de téléphone invalide')
    .optional(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe est trop long')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'admin', 'delivery', 'advisor']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const PasswordResetRequestSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .min(1, 'L\'email est requis'),
});

export const PasswordResetConfirmSchema = z.object({
  uid: z.string().min(1, 'UID requis'),
  token: z.string().min(1, 'Token requis'),
  newPassword: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe est trop long'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string()
    .min(1, 'L\'ancien mot de passe est requis'),
  newPassword: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe est trop long'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const ProfileUpdateSchema = z.object({
  firstName: z.string().max(50, 'Le prénom est trop long').optional(),
  lastName: z.string().max(50, 'Le nom est trop long').optional(),
  phone: z.string()
    .regex(/^(\+?[0-9]{1,3})?[0-9]{9,12}$/, 'Numéro de téléphone invalide')
    .optional(),
  bio: z.string().max(500, 'La bio est trop longue').optional(),
  avatar: z.any().optional(),
});

// ============ ADDRESS VALIDATORS ============

export const AddressSchema = z.object({
  label: z.string()
    .min(1, 'Le libellé est requis')
    .max(50, 'Le libellé est trop long'),
  street: z.string()
    .min(1, 'La rue est requise')
    .max(255, 'La rue est trop longue'),
  city: z.string()
    .min(1, 'La ville est requise')
    .max(100, 'La ville est trop longue'),
  state: z.string()
    .min(1, 'La région est requise')
    .max(100, 'La région est trop longue'),
  country: z.string()
    .min(1, 'Le pays est requis')
    .max(100, 'Le pays est trop long'),
  postalCode: z.string()
    .min(1, 'Le code postal est requis')
    .max(20, 'Le code postal est trop long'),
  phone: z.string()
    .regex(/^(\+?[0-9]{1,3})?[0-9]{9,12}$/, 'Numéro de téléphone invalide'),
  isDefault: z.boolean().default(false),
  instructions: z.string().max(500, 'Les instructions sont trop longues').optional(),
});

// ============ PRODUCT VALIDATORS ============

export const ProductReviewSchema = z.object({
  rating: z.number()
    .min(1, 'La note doit être entre 1 et 5')
    .max(5, 'La note doit être entre 1 et 5'),
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre est trop long'),
  comment: z.string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(2000, 'Le commentaire est trop long'),
});

// ============ ORDER VALIDATORS ============

export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Le produit est requis'),
    variantId: z.string().optional(),
    quantity: z.number()
      .min(1, 'La quantité doit être d\'au moins 1')
      .max(99, 'La quantité maximale est de 99'),
  })).min(1, 'Au moins un produit est requis'),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  paymentMethod: z.enum(['card', 'mobile_money', 'bank_transfer', 'cash_on_delivery', 'wallet']),
  couponCode: z.string().optional(),
  notes: z.string().max(500, 'Les notes sont trop longues').optional(),
  isGift: z.boolean().default(false),
  giftMessage: z.string().max(500, 'Le message cadeau est trop long').optional(),
  deliveryInstructions: z.string().max(500, 'Les instructions de livraison sont trop longues').optional(),
});

// ============ CART VALIDATORS ============

export const CouponSchema = z.object({
  code: z.string()
    .min(3, 'Le code doit contenir au moins 3 caractères')
    .max(50, 'Le code est trop long')
    .regex(/^[A-Z0-9]+$/, 'Le code ne peut contenir que des lettres majuscules et des chiffres'),
});

// ============ SUPPORT VALIDATORS ============

export const CreateTicketSchema = z.object({
  subject: z.string()
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200, 'Le sujet est trop long'),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message est trop long'),
  category: z.enum(['order', 'payment', 'delivery', 'product', 'account', 'technical', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  relatedOrderId: z.string().optional(),
  relatedProductId: z.string().optional(),
});

export const TicketReplySchema = z.object({
  message: z.string()
    .min(1, 'Le message est requis')
    .max(5000, 'Le message est trop long'),
});

// ============ PAYMENT VALIDATORS ============

export const CardPaymentSchema = z.object({
  cardNumber: z.string()
    .regex(/^[0-9]{16}$/, 'Numéro de carte invalide'),
  expMonth: z.number()
    .min(1, 'Le mois doit être entre 1 et 12')
    .max(12, 'Le mois doit être entre 1 et 12'),
  expYear: z.number()
    .min(new Date().getFullYear(), 'L\'année doit être future'),
  cvc: z.string()
    .regex(/^[0-9]{3,4}$/, 'CVC invalide'),
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom est trop long'),
});

export const MobileMoneyPaymentSchema = z.object({
  phone: z.string()
    .regex(/^(\+?[0-9]{1,3})?[0-9]{9,12}$/, 'Numéro de téléphone invalide'),
  provider: z.enum(['orange', 'wave', 'free', 'expresso']),
  amount: z.number()
    .min(100, 'Le montant minimum est de 100 FCFA'),
});

// ============ SEARCH VALIDATORS ============

export const SearchQuerySchema = z.object({
  q: z.string()
    .min(1, 'La recherche est requise')
    .max(200, 'La recherche est trop longue'),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest', 'popular']).optional(),
  inStock: z.boolean().optional(),
  onSale: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ============ CONTACT VALIDATORS ============

export const ContactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long'),
  email: z.string()
    .email('Email invalide')
    .min(1, 'L\'email est requis'),
  subject: z.string()
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200, 'Le sujet est trop long'),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message est trop long'),
});

// ============ TYPE INFERENCES ============

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type PasswordResetRequestFormData = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof PasswordResetConfirmSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;
export type AddressFormData = z.infer<typeof AddressSchema>;
export type ProductReviewFormData = z.infer<typeof ProductReviewSchema>;
export type CreateOrderFormData = z.infer<typeof CreateOrderSchema>;
export type CouponFormData = z.infer<typeof CouponSchema>;
export type CreateTicketFormData = z.infer<typeof CreateTicketSchema>;
export type TicketReplyFormData = z.infer<typeof TicketReplySchema>;
export type CardPaymentFormData = z.infer<typeof CardPaymentSchema>;
export type MobileMoneyPaymentFormData = z.infer<typeof MobileMoneyPaymentSchema>;
export type SearchQueryFormData = z.infer<typeof SearchQuerySchema>;
export type ContactFormData = z.infer<typeof ContactSchema>;

// ============ EXPORT ============

export default {
  LoginSchema,
  RegisterSchema,
  PasswordResetRequestSchema,
  PasswordResetConfirmSchema,
  ChangePasswordSchema,
  ProfileUpdateSchema,
  AddressSchema,
  ProductReviewSchema,
  CreateOrderSchema,
  CouponSchema,
  CreateTicketSchema,
  TicketReplySchema,
  CardPaymentSchema,
  MobileMoneyPaymentSchema,
  SearchQuerySchema,
  ContactSchema,
};