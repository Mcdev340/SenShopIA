import { NextRequest, NextResponse } from "next/server";

// Données mockées pour l'exemple (à remplacer par une vraie base de données)
const MOCK_USER = {
  id: "1",
  email: "demo@shopsense-ai.com",
  password: "password123", // En réalité, stocké hashé
  username: "demo",
  role: "client",
  firstName: "Demo",
  lastName: "User",
  phone: "+221 77 123 45 67",
  isVerified: true,
  createdAt: new Date(),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 },
      );
    }

    // Vérification des identifiants
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // Générer un token mocké
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Créer la réponse
    const response = NextResponse.json({
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        username: MOCK_USER.username,
        role: MOCK_USER.role,
        firstName: MOCK_USER.firstName,
        lastName: MOCK_USER.lastName,
        phone: MOCK_USER.phone,
        isVerified: MOCK_USER.isVerified,
        createdAt: MOCK_USER.createdAt,
      },
      token,
      refresh: refreshToken,
    });

    // Définir les cookies
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
