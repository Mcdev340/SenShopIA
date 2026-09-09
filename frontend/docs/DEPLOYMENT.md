# Déploiement

## Préparer

```bash
npm ci
npm run type-check
npm run build
```

## Variables d’environnement

Configurez les URL d’API et les clés de télémétrie dans l’environnement de déploiement. Ne placez jamais de secret dans le code client.

## Démarrer

```bash
npm run start
```

Le service doit exposer les routes de santé de l’hébergeur et servir l’application en HTTPS.
