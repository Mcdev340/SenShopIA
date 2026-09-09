import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Mock cart data
let mockCart: any = {
  id: "cart_1",
  userId: "1",
  items: [
    {
      id: "item_1",
      productId: "1",
      product: {
        id: "1",
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        price: 1500000,
        salePrice: 1400000,
        stock: 10,
        images: ["/images/products/iphone-15.jpg"],
        brand: "Apple",
        rating: 4.8,
        reviewsCount: 120,
      },
      quantity: 1,
      price: 1400000,
      total: 1400000,
      selected: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item_2",
      productId: "2",
      product: {
        id: "2",
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        price: 1300000,
        salePrice: null,
        stock: 5,
        images: ["/images/products/samsung-s24.jpg"],
        brand: "Samsung",
        rating: 4.7,
        reviewsCount: 85,
      },
      quantity: 2,
      price: 1300000,
      total: 2600000,
      selected: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  subtotal: 4000000,
  total: 4000000,
  shippingCost: 0,
  tax: 0,
  discount: 0,
  couponCode: null,
  couponDiscount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    // Vérifier si le produit existe déjà dans le panier
    const existingItem = mockCart.items.find(
      (item: any) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      // Ajouter un nouveau produit (mock)
      const newItem = {
        id: `item_${Date.now()}`,
        productId,
        product: {
          id: productId,
          name: `Produit ${productId}`,
          slug: `produit-${productId}`,
          price: 50000,
          salePrice: null,
          stock: 10,
          images: [],
          brand: "Marque",
          rating: 4.5,
          reviewsCount: 10,
        },
        quantity,
        price: 50000,
        total: 50000 * quantity,
        selected: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCart.items.push(newItem);
    }

    // Recalculer les totaux
    mockCart.subtotal = mockCart.items.reduce(
      (sum: number, item: any) => sum + item.total,
      0,
    );
    mockCart.total =
      mockCart.subtotal - mockCart.discount + mockCart.shippingCost;

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vider le panier
    mockCart.items = [];
    mockCart.subtotal = 0;
    mockCart.total = 0;

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
