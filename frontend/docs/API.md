# API

Les routes internes de l’application sont servies sous `/api`.

## Authentification

- `POST /api/auth/login` ouvre une session et crée les cookies `token` et `refreshToken`.
- `POST /api/auth/register` crée un compte de démonstration.
- `GET /api/auth/me` retourne l’utilisateur connecté.
- `PUT /api/auth/me` met à jour le profil connecté.

## Produits

- `GET /api/products` accepte les filtres `search`, `category`, `sortBy`, `page` et `limit`.

## Panier

- `GET /api/cart` récupère le panier.
- `POST /api/cart` ajoute un produit avec `productId` et `quantity`.
- `DELETE /api/cart` vide le panier.

Toutes les réponses d’erreur utilisent un objet `{ error: string }`.
