
# Final Project - NestJS Social App

## Prérequis
- Node.js (v18+ recommandé)
- npm
- PostgreSQL (ou autre SGBD compatible Prisma)

## Installation
1. **Cloner le projet**
2. **Installer les dépendances** :
  ```bash
  npm install
  ```
3. **Configurer la base de données** :
  - Modifier le fichier `.env` avec votre URL de connexion (exemple : `DATABASE_URL="postgresql://user:password@localhost:5432/dbname"`)
  - Modifier le fichier `.env` avec votre clé secrète pour les token (exemple : `JWT_SECRET="ceciestuntokensupersupersecretnenparleapersonnesinonilseraplussisecretlol`)
  
4. **Initialiser Prisma** :
  ```bash
  npx prisma migrate dev
  npx prisma generate
  ```
5. **Lancer l'application** :
  ```bash
  npm run start:dev
  ```

## Authentification
- Utilisation de JWT (token à fournir dans l'en-tête Authorization : `Bearer <token>`)

## Routes principales

### Pour faire vos tests
- Un fichier postman_collection.json vous est accessible à la racine du projet, il vous suffit de l'importer dans votre Postman en cliquant sur import en haut à gauche ce qui vous permettra de récupérer toutes les routes testables 
-Pour automatiser le token et ne pas avoir à le mettre à la main dans Authorization à chaque fois, cliquez sur environnement à droite de votre postman, créer un environnement et ajouter lui une variable token vide, puis de retour dans les collections, en haut à droite selectionner votre environnement pour que l'automatisation soit active. TADA la magie de l'automatisation ptn !

### Utilisateurs
- `POST /auth/register` : Créer un compte utilisateur
- `POST /auth/login` : Se connecter et recevoir un token JWT ( body : `{ email, password }`)
- `GET /user/me` : Voir son profil (authentifié)
- `GET /user/:name` : Voir le profil d'un autre utilisateur
- `PUT /user/update` : Modifier son profil (authentifié)

### Follow
- `POST /follow` : Suivre ou ne plus suivre un utilisateur (authentifié, body : `{ following_id }`)
- `GET /follow/my-followers` : Voir la liste de ses abonnés
- `GET /follow/my-follows` : Voir la liste des personnes suivies

### Posts
- `POST /post` : Publier un post (authentifié, body : `{ content, image? }`)
- `GET /post` : Voir tous les posts
- `GET /post/feed` : Voir le feed personnalisé (posts des personnes suivies)
- `GET /post/:id` : Voir un post précis
- `PUT /post/:id` : Modifier son post (authentifié)
- `DELETE /post/:id` : Supprimer son post (authentifié)

### Likes
- `POST /like` : Liker un post (authentifié, body : `{ post_id }`)
- `DELETE /like/:id` : Retirer son like

## Fonctionnalités
- Création et gestion de compte utilisateur
- Système de follow/unfollow
- Publication, modification et suppression de posts
- Feed personnalisé (posts des personnes suivies)
- Système de likes (un seul like par post et par utilisateur)

## Notes
- Toutes les routes sauf l'inscription et la connexion nécessitent un token JWT.
- Les erreurs sont retournées avec un message explicite.

## Structure du projet
- `src/auth` : Authentification
- `src/user` : Utilisateurs
- `src/follow` : Système de follow
- `src/post` : Posts
- `src/like` : Likes

---
Pour toute question ou bug, contactez NairoD34.
