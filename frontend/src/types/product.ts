export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  isMain: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: Category;
  categoryId: string;
  brand?: string;
  images: string[];
  variants: ProductVariant[];
  tags: ProductTag[];
  specifications?: Record<string, string>;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  viewsCount: number;
  soldCount: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
  finalPrice?: number;
}

export interface ProductFilter {
  category?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  tags?: string[];
  attributes?: Record<string, string[]>;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular' | 'sold';
  search?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
  onSale?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets?: {
    categories: { id: string; name: string; count: number }[];
    brands: { name: string; count: number }[];
    tags: { name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  notHelpful: number;
  replies: ProductReviewReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  comment: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductComparison {
  products: Product[];
  similarities: string[];
  differences: Record<string, string[]>;
  bestValue?: string;
  bestRating?: string;
  cheapest?: string;
  recommendations: string[];
}

export interface ExternalProductRequest {
  id: string;
  url: string;
  marketplace: string;
  productData: Partial<Product>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  userId: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductStockUpdate {
  productId: string;
  variantId?: string;
  quantity: number;
  type: 'add' | 'remove' | 'set';
  reason: 'order' | 'restock' | 'correction' | 'return';
  reference?: string;
  createdAt: Date;
  createdBy: string;
}

export interface ProductPriceHistory {
  id: string;
  productId: string;
  price: number;
  salePrice?: number;
  date: Date;
}

export interface RelatedProduct {
  id: string;
  productId: string;
  relatedProductId: string;
  relatedProduct: Product;
  relevance: number;
  createdAt: Date;
}

export interface ProductBulkOperation {
  ids: string[];
  action: 'delete' | 'update' | 'feature' | 'unfeature' | 'activate' | 'deactivate';
  data?: Partial<Product>;
}