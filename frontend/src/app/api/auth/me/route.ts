import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MOCK_USER = {
  id: "1",
  email: "demo@shopsense-ai.com",
  username: "demo",
  role: "client",
  firstName: "Demo",
  lastName: "User",
  phone: "+221 77 123 45 67",
  isVerified: true,
  avatar: null,
  bio: "Utilisateur de démonstration",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier que le token est valide (mock)
    if (!token.startsWith("mock_token_")) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    return NextResponse.json(MOCK_USER);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, bio } = body;

    // Mettre à jour l'utilisateur (mock)
    const updatedUser = {
      ...MOCK_USER,
      firstName: firstName || MOCK_USER.firstName,
      lastName: lastName || MOCK_USER.lastName,
      phone: phone || MOCK_USER.phone,
      bio: bio || MOCK_USER.bio,
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
