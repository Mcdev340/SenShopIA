import { NextRequest, NextResponse } from 'next/server';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Le dernier iPhone avec puce A17 Pro, écran Super Retina XDR et appareil photo 48MP.',
    shortDescription: 'Le smartphone le plus puissant d\'Apple.',
    price: 1500000,
    salePrice: 1400000,
    stock: 10,
    category: {
      id: '1',
      name: 'Électronique',
      slug: 'electronics',
    },
    brand: 'Apple',
    images: ['/images/products/iphone-15.jpg'],
    specifications: {
      'Couleur': 'Noir',
      'Stockage': '256 Go',
      'Réseau': '5G',
    },
    rating: 4.8,
    reviewsCount: 120,
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    viewsCount: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Le flagship Samsung avec écran AMOLED, appareil photo 200MP et S Pen intégré.',
    shortDescription: 'Le meilleur de Samsung.',
    price: 1300000,
    salePrice: null,
    stock: 5,
    category: {
      id: '1',
      name: 'Électronique',
      slug: 'electronics',
    },
    brand: 'Samsung',
    images: ['/images/products/samsung-s24.jpg'],
    specifications: {
      'Couleur': 'Violet',
      'Stockage': '256 Go',
      'Réseau': '5G',
    },
    rating: 4.7,
    reviewsCount: 85,
    isAvailable: true,
    isFeatured: true,
    isNew: false,
    viewsCount: 1200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Baskets Nike Air Max 270 avec amorti Air Max pour un confort optimal.',
    shortDescription: 'Confort et style.',
    price: 150000,
    salePrice: 120000,
    stock: 20,
    category: {
      id: '2',
      name: 'Vêtements',
      slug: 'clothing',
    },
    brand: 'Nike',
    images: ['/images/products/nike-airmax.jpg'],
    specifications: {
      'Taille': '42',
      'Couleur': 'Blanc/Noir',
      'Matériau': 'Cuir',
    },
    rating: 4.6,
    reviewsCount: 200,
    isAvailable: true,
    isFeatured: false,
    isNew: true,
    viewsCount: 800,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    description: 'Le MacBook Pro avec puce M3, 16GB de RAM et SSD 512GB.',
    shortDescription: 'La puissance Apple.',
    price: 2500000,
    salePrice: 2300000,
    stock: 3,
    category: {
      id: '1',
      name: 'Électronique',
      slug: 'electronics',
    },
    brand: 'Apple',
    images: ['/images/products/macbook-pro.jpg'],
    specifications: {
      'Couleur': 'Gris sidéral',
      'Stockage': '512 Go',
      'RAM': '16 Go',
    },
    rating: 4.9,
    reviewsCount: 60,
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    viewsCount: 2000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'PlayStation 5',
    slug: 'playstation-5',
    description: 'La console PlayStation 5 avec manette DualSense et 1TB de stockage.',
    shortDescription: 'La nouvelle génération de gaming.',
    price: 500000,
    salePrice: null,
    stock: 8,
    category: {
      id: '3',
      name: 'Gaming',
      slug: 'gaming',
    },
    brand: 'Sony',
    images: ['/images/products/ps5.jpg'],
    specifications: {
      'Stockage': '1 To',
      'Couleur': 'Blanc',
    },
    rating: 4.8,
    reviewsCount: 150,
    isAvailable: true,
    isFeatured: false,
    isNew: false,
    viewsCount: 1100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Sofa 3 Places',
    slug: 'sofa-3-places',
    description: 'Sofa 3 places en tissu, coloris gris, avec coussins de confort.',
    shortDescription: 'Confort et élégance.',
    price: 350000,
    salePrice: 280000,
    stock: 4,
    category: {
      id: '4',
      name: 'Maison',
      slug: 'home',
    },
    brand: 'Maison du Monde',
    images: ['/images/products/sofa.jpg'],
    specifications: {
      'Couleur': 'Gris',
      'Matière': 'Tissu',
      'Dimensions': '220x90x80 cm',
    },
    rating: 4.4,
    reviewsCount: 45,
    isAvailable: true,
    isFeatured: false,
    isNew: false,
    viewsCount: 450,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || 'Infinity');

    let products = [...mockProducts];

    // Filtrer par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par catégorie
    if (category) {
      products = products.filter((p) => p.category.slug === category);
    }

    // Filtrer par prix
    products = products.filter(
      (p) =>
        (p.salePrice || p.price) >= minPrice &&
        (p.salePrice || p.price) <= maxPrice
    );

    // Trier
    switch (sortBy) {
      case 'price_asc':
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        products.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Pagination
    const total = products.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = products.slice(start, end);

    return NextResponse.json({
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProduct = {
      id: `product_${Date.now()}`,
      ...body,
      rating: 0,
      reviewsCount: 0,
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProducts.unshift(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}