import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      username,
      email,
      phone,
      password,
      confirmPassword,
      role = "client",
    } = body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 },
      );
    }

    // Vérifier si l'email existe déjà (mock)
    if (email === "existing@example.com") {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 },
      );
    }

    // Créer l'utilisateur (mock)
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      phone: phone || "",
      role,
      firstName: "",
      lastName: "",
      isVerified: false,
      avatar: null,
      bio: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Générer un token mocké
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Créer la réponse
    const response = NextResponse.json({
      user: newUser,
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
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
