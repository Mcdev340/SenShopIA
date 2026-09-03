/**
 * ============================================
 * COMPONENTS - EXPORT PRINCIPAL
 * ============================================
 * Ce fichier exporte tous les composants
 * de l'application ShopSense AI.
 * 
 * Les composants sont organisés par catégorie :
 * - Layout (mise en page)
 * - UI (composants d'interface)
 * - Forms (formulaires)
 * - Products (produits)
 * - Cart (panier)
 * - Checkout (paiement)
 * - Orders (commandes)
 * - Chat (messagerie)
 * - Dashboard (tableaux de bord)
 * - Auth (authentification)
 * - Shared (partagés)
 * ============================================
 */

// ============================================
// LAYOUT
// ============================================
export { default as Layout } from './layout/Layout';
export { default as Navbar } from './layout/Navbar';
export { default as Footer } from './layout/Footer';
export { default as Sidebar } from './layout/Sidebar';
export { default as Header } from './layout/Header';
export { default as Container } from './layout/Container';
export { default as MainLayout } from './layout/MainLayout';
export { default as AuthLayout } from './layout/AuthLayout';
export { default as DashboardLayout } from './layout/DashboardLayout';

// ============================================
// UI - COMPOSANTS DE BASE
// ============================================
export { default as Button } from './ui/Button';
export { default as Input } from './ui/Input';
export { default as Textarea } from './ui/Textarea';
export { default as Select } from './ui/Select';
export { default as Checkbox } from './ui/Checkbox';
export { default as Radio } from './ui/Radio';
export { default as Switch } from './ui/Switch';
export { default as Badge } from './ui/Badge';
export { default as Card } from './ui/Card';
export { default as CardHeader } from './ui/Card';
export { default as CardBody } from './ui/Card';
export { default as CardFooter } from './ui/Card';
export { default as Modal } from './ui/Modal';
export { default as Drawer } from './ui/Drawer';
export { default as Toast } from './ui/Toast';
export { default as ToastContainer } from './ui/Toast';
export { default as Spinner } from './ui/Spinner';
export { default as Skeleton } from './ui/Skeleton';
export { default as Avatar } from './ui/Avatar';
export { default as Tooltip } from './ui/Tooltip';
export { default as Dropdown } from './ui/Dropdown';
export { default as Tabs } from './ui/Tabs';
export { default as Tab } from './ui/Tabs';
export { default as Accordion } from './ui/Accordion';
export { default as AccordionItem } from './ui/Accordion';
export { default as Pagination } from './ui/Pagination';
export { default as Breadcrumb } from './ui/Breadcrumb';
export { default as Alert } from './ui/Alert';
export { default as Progress } from './ui/Progress';
export { default as Rating } from './ui/Rating';
export { default as Tag } from './ui/Tag';
export { default as Chip } from './ui/Chip';
export { default as Divider } from './ui/Divider';
export { default as Icon } from './ui/Icon';
export { default as Image } from './ui/Image';
export { default as Link } from './ui/Link';
export { default as Typography } from './ui/Typography';
export { default as List } from './ui/List';
export { default as ListItem } from './ui/List';
export { default as Table } from './ui/Table';
export { default as TableHeader } from './ui/Table';
export { default as TableBody } from './ui/Table';
export { default as TableRow } from './ui/Table';
export { default as TableCell } from './ui/Table';

// ============================================
// UI - COMPOSANTS SPÉCIALISÉS
// ============================================
export { default as Grid } from './ui/Grid';
export { default as Stack } from './ui/Stack';
export { default as Flex } from './ui/Flex';
export { default as Center } from './ui/Center';
export { default as Box } from './ui/Box';
export { default as Container as UIContainer } from './ui/Container';
export { default as Section } from './ui/Section';
export { default as Hero } from './ui/Hero';

// ============================================
// FORMS
// ============================================
export { default as Form } from './forms/Form';
export { default as FormField } from './forms/FormField';
export { default as FormLabel } from './forms/FormLabel';
export { default as FormError } from './forms/FormError';
export { default as FormSuccess } from './forms/FormSuccess';
export { default as FormHelper } from './forms/FormHelper';
export { default as FormGroup } from './forms/FormGroup';
export { default as FormRow } from './forms/FormRow';
export { default as FormSection } from './forms/FormSection';

// ============================================
// PRODUCTS
// ============================================
export { default as ProductCard } from './products/ProductCard';
export { default as ProductGrid } from './products/ProductGrid';
export { default as ProductList } from './products/ProductList';
export { default as ProductFilters } from './products/ProductFilters';
export { default as ProductDetails } from './products/ProductDetails';
export { default as ProductImages } from './products/ProductImages';
export { default as ProductReviews } from './products/ProductReviews';
export { default as ProductRating } from './products/ProductRating';
export { default as ProductPrice } from './products/ProductPrice';
export { default as ProductStock } from './products/ProductStock';
export { default as ProductVariant } from './products/ProductVariant';
export { default as ProductActions } from './products/ProductActions';
export { default as ProductMeta } from './products/ProductMeta';
export { default as ProductDescription } from './products/ProductDescription';
export { default as ProductSpecifications } from './products/ProductSpecifications';
export { default as ProductRelated } from './products/ProductRelated';
export { default as ProductBreadcrumb } from './products/ProductBreadcrumb';
export { default as ProductNotFound } from './products/ProductNotFound';

// ============================================
// CART
// ============================================
export { default as CartItem } from './cart/CartItem';
export { default as CartList } from './cart/CartList';
export { default as CartSummary } from './cart/CartSummary';
export { default as CartEmpty } from './cart/CartEmpty';
export { default as CartDrawer } from './cart/CartDrawer';
export { default as CartIcon } from './cart/CartIcon';
export { default as CartBadge } from './cart/CartBadge';

// ============================================
// CHECKOUT
// ============================================
export { default as CheckoutForm } from './checkout/CheckoutForm';
export { default as CheckoutSummary } from './checkout/CheckoutSummary';
export { default as CheckoutSteps } from './checkout/CheckoutSteps';
export { default as ShippingForm } from './checkout/ShippingForm';
export { default as PaymentForm } from './checkout/PaymentForm';
export { default as OrderSummary } from './checkout/OrderSummary';
export { default as CheckoutSuccess } from './checkout/CheckoutSuccess';
export { default as CheckoutCancel } from './checkout/CheckoutCancel';

// ============================================
// ORDERS
// ============================================
export { default as OrderCard } from './orders/OrderCard';
export { default as OrderList } from './orders/OrderList';
export { default as OrderStatus } from './orders/OrderStatus';
export { default as OrderTracking } from './orders/OrderTracking';
export { default as OrderInvoice } from './orders/OrderInvoice';
export { default as OrderDetails } from './orders/OrderDetails';
export { default as OrderSummary as OrderSummaryCard } from './orders/OrderSummary';
export { default as OrderItem } from './orders/OrderItem';
export { default as OrderEmpty } from './orders/OrderEmpty';

// ============================================
// CHAT
// ============================================
export { default as ChatInterface } from './chat/ChatInterface';
export { default as ChatMessage } from './chat/ChatMessage';
export { default as ChatInput } from './chat/ChatInput';
export { default as ChatHeader } from './chat/ChatHeader';
export { default as ChatList } from './chat/ChatList';
export { default as ChatBubble } from './chat/ChatBubble';
export { default as ChatTyping } from './chat/ChatTyping';
export { default as ChatEmpty } from './chat/ChatEmpty';

// ============================================
// DASHBOARD
// ============================================
export { default as DashboardLayout as DashboardLayoutComponent } from './dashboard/DashboardLayout';
export { default as StatsCard } from './dashboard/StatsCard';
export { default as StatsGrid } from './dashboard/StatsGrid';
export { default as ChartCard } from './dashboard/ChartCard';
export { default as RecentOrders } from './dashboard/RecentOrders';
export { default as RecentActivity } from './dashboard/RecentActivity';
export { default as QuickActions } from './dashboard/QuickActions';
export { default as DashboardHeader } from './dashboard/DashboardHeader';
export { default as DashboardSidebar } from './dashboard/DashboardSidebar';
export { default as DashboardStats } from './dashboard/DashboardStats';
export { default as DashboardCharts } from './dashboard/DashboardCharts';

// ============================================
// AUTH
// ============================================
export { default as LoginForm } from './auth/LoginForm';
export { default as RegisterForm } from './auth/RegisterForm';
export { default as ResetPasswordForm } from './auth/ResetPasswordForm';
export { default as VerifyEmail } from './auth/VerifyEmail';
export { default as ForgotPasswordForm } from './auth/ForgotPasswordForm';
export { default as AuthGuard } from './auth/AuthGuard';
export { default as RoleGuard } from './auth/RoleGuard';

// ============================================
// SHARED
// ============================================
export { default as Loading } from './shared/Loading';
export { default as Error } from './shared/Error';
export { default as EmptyState } from './shared/EmptyState';
export { default as NoResults } from './shared/NoResults';
export { default as ConfirmDialog } from './shared/ConfirmDialog';
export { default as SearchBar } from './shared/SearchBar';
export { default as ThemeToggle } from './shared/ThemeToggle';
export { default as LanguageSwitcher } from './shared/LanguageSwitcher';
export { default as ScrollToTop } from './shared/ScrollToTop';
export { default as BackButton } from './shared/BackButton';
export { default as LoadingOverlay } from './shared/LoadingOverlay';
export { default as ErrorBoundary } from './shared/ErrorBoundary';
export { default as Suspense } from './shared/Suspense';
export { default as Portal } from './shared/Portal';
export { default as Transition } from './shared/Transition';
export { default as Counter } from './shared/Counter';
export { default as Timer } from './shared/Timer';

// ============================================
// EXPORT PAR DÉFAUT
// ============================================
export default {
  // Layout
  Layout,
  Navbar,
  Footer,
  Sidebar,
  Header,
  Container,
  MainLayout,
  AuthLayout,
  DashboardLayout,

  // UI - Base
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Drawer,
  Toast,
  ToastContainer,
  Spinner,
  Skeleton,
  Avatar,
  Tooltip,
  Dropdown,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Pagination,
  Breadcrumb,
  Alert,
  Progress,
  Rating,
  Tag,
  Chip,
  Divider,
  Icon,
  Image,
  Link,
  Typography,
  List,
  ListItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,

  // UI - Spécialisés
  Grid,
  Stack,
  Flex,
  Center,
  Box,
  UIContainer,
  Section,
  Hero,

  // Forms
  Form,
  FormField,
  FormLabel,
  FormError,
  FormSuccess,
  FormHelper,
  FormGroup,
  FormRow,
  FormSection,

  // Products
  ProductCard,
  ProductGrid,
  ProductList,
  ProductFilters,
  ProductDetails,
  ProductImages,
  ProductReviews,
  ProductRating,
  ProductPrice,
  ProductStock,
  ProductVariant,
  ProductActions,
  ProductMeta,
  ProductDescription,
  ProductSpecifications,
  ProductRelated,
  ProductBreadcrumb,
  ProductNotFound,

  // Cart
  CartItem,
  CartList,
  CartSummary,
  CartEmpty,
  CartDrawer,
  CartIcon,
  CartBadge,

  // Checkout
  CheckoutForm,
  CheckoutSummary,
  CheckoutSteps,
  ShippingForm,
  PaymentForm,
  OrderSummary,
  CheckoutSuccess,
  CheckoutCancel,

  // Orders
  OrderCard,
  OrderList,
  OrderStatus,
  OrderTracking,
  OrderInvoice,
  OrderDetails,
  OrderSummaryCard,
  OrderItem,
  OrderEmpty,

  // Chat
  ChatInterface,
  ChatMessage,
  ChatInput,
  ChatHeader,
  ChatList,
  ChatBubble,
  ChatTyping,
  ChatEmpty,

  // Dashboard
  DashboardLayoutComponent,
  StatsCard,
  StatsGrid,
  ChartCard,
  RecentOrders,
  RecentActivity,
  QuickActions,
  DashboardHeader,
  DashboardSidebar,
  DashboardStats,
  DashboardCharts,

  // Auth
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  VerifyEmail,
  ForgotPasswordForm,
  AuthGuard,
  RoleGuard,

  // Shared
  Loading,
  Error,
  EmptyState,
  NoResults,
  ConfirmDialog,
  SearchBar,
  ThemeToggle,
  LanguageSwitcher,
  ScrollToTop,
  BackButton,
  LoadingOverlay,
  ErrorBoundary,
  Suspense,
  Portal,
  Transition,
  Counter,
  Timer,
};