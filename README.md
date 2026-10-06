# ODDAWORLD | Cosmétiques Botaniques & Soins Éclat Haute Performance 🌿✨

Bienvenue sur le dépôt officiel d'**ODDAWORLD**, une plateforme e-commerce haut de gamme dédiée aux cosmétiques clean beauty, véganes et éco-responsables, formulés et fabriqués en France.

[![GitHub Repository](https://img.shields.io/badge/GitHub-cosmetique--informatiquedaniele--maker-181717?style=flat&logo=github)](https://github.com/informatiquedaniele-maker/cosmetique-)
[![Supabase Database](https://img.shields.io/badge/Supabase-Connected_%26_Active-3ECF8E?style=flat&logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)

---

## 📑 Sommaire
- [Aperçu & Démonstration](#-aperçu--démonstration)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Connexion Backend Cloud Supabase](#-connexion-backend-cloud-supabase)
- [Architecture & Structure des Fichiers](#-architecture--structure-des-fichiers)
- [Installation & Démarrage Local](#-installation--démarrage-local)
- [Technologies Utilisées](#-technologies-utilisées)
- [Synchronisation GitHub & Déploiement](#-synchronisation-github--déploiement)

---

## 🌟 Aperçu & Démonstration

Le site propose une expérience e-commerce immersive, ultra-rapide et responsive, combinant un design épuré (palette botanique, typographies modernes, micro-interactions soignées) et des fonctionnalités avancées dignes des plus grandes maisons de cosmétiques.

- **URL de développement local** : [http://localhost:3000/](http://localhost:3000/)
- **Dépôt GitHub** : [https://github.com/informatiquedaniele-maker/cosmetique-.git](https://github.com/informatiquedaniele-maker/cosmetique-.git)

---

## 🚀 Fonctionnalités Principales

### 1. Navigation & En-tête Flottant (Floating Capsule Header)
- **Barre de navigation pilule moderne** : Flottante avec effet glassmorphism (flou d'arrière-plan).
- **Navigation mobile optimisée** : Barre inférieure fixe (*sticky bottom bar*) pour une ergonomie sur smartphone, combinée à un tiroir de menu latéral complet (*drawer*).
- **Compteurs dynamiques en temps réel** : Badges animés pour le panier et la liste d'envies (*wishlist*).

### 2. Catalogue de Soins & Filtrage Avancé
- **Filtrage par Catégorie** : Nettoyants, Sérums, Crèmes hydratantes, Protections solaires SPF 50+, Masques, Soins des lèvres.
- **Filtrage par Type de Peau** : Peaux sèches, mixtes, sensibles, matures.
- **Recherche instantanée** : Filtre en temps réel sur les noms, descriptions et ingrédients.
- **Tri intelligent** : Par popularité (bestsellers), notes clients (étoiles), prix croissant/décroissant, ou nouveautés.

### 3. Fiches Produits & Modale Aperçu Rapide (Quick View)
- Modale détaillée avec galerie d'images, avis vérifiés, description sensorielle.
- Liste détaillée des **actifs clés et bienfaits INCI**.
- Conseils d'application et positionnement dans le rituel.
- **Module de vente croisée (cross-selling)** : Suggestion de soins complémentaires avec réduction immédiate.

### 4. Comparateur de Soins Multi-Produits
- Permet de comparer jusqu'à **3 soins côte à côte** sur un tableau clair :
  - Catégorie, contenance, texture, moment d'application, actifs phares, note client et ajout direct au panier.

### 5. Panier Interactif & Barre de Livraison Offerte
- Panier coulissant (*Slide-Over Drawer*) sans rechargement de page.
- **Jauge de progression dynamique** pour la livraison offerte (seuil fixé à 50 €).
- Gestion des quantités, suppression et calcul en temps réel du sous-total, des remises et des frais de port.
- **Système de codes promotionnels** :
  - `WELCOME10` : -10% de bienvenue
  - `GLOW15` : -15% sur les rituels complets

### 6. Tunnel de Commande & Checkout Sécurisé (3 Étapes)
- **Étape 1 : Coordonnées & Livraison** :
  - Formulaire complet avec sélecteur de pays étendu.
  - **Localisation GPS Google Maps en un clic** : Intégration de la géolocalisation du navigateur pour générer un lien précis destiné au livreur.
- **Étape 2 : Mode d'Expédition** :
  - Colissimo Domicile neutre en carbone avec suivi SMS.
- **Étape 3 : Paiement Sécurisé & Visualiseur de Carte** :
  - Visualiseur de carte bancaire 3D interactif animé (mise à jour en direct du titulaire, numéro et date).
  - Prise en charge simulée d'Apple Pay et Google Pay en 1 clic.
  - Validation sécurisée et génération automatique de l'ID de commande (`ODDA-XXXXX`).

### 7. Quiz de Diagnostic de Peau Scientifique (Skin Quiz)
- Questionnaire interactif en plusieurs étapes pour déterminer le type de peau et la préoccupation cutanée majeure.
- Calcul de la routine personnalisée idéale avec recommandation d'un pack 3 soins à -15%.
- Ajout de l'ensemble de la routine au panier en un seul clic.

### 8. Assistante Beauté Virtuelle (Chatbot Skincare)
- Widget de discussion flottant avec réponses instantanées.
- Reconnaissance intelligente par mots-clés :
  - Conseils pour peaux sensibles, teints ternes, protection solaire.
  - Suivi de colis et délais d'expédition.
  - Codes promotionnels disponibles.
  - Déclencheur direct vers le Quiz de peau ou fiches produits recommandées.

### 9. Preuve Sociale en Temps Réel (Social Proof Toasts)
- Notifications discrètes et élégantes simulant les achats récents de la communauté dans différentes villes de France pour maximiser la confiance et le taux de conversion.

### 10. Espace Client & Programme Fidélité "Glow Club"
- **Profil personnel** : Modification des coordonnées.
- **Historique des commandes** : Liste des commandes avec statuts et simulation de facture PDF.
- **Liste d'envies (Wishlist)** : Sauvegarde des coups de cœur avec bouton d'ajout groupé au panier.
- **Glow Points** : Système de points fidélité (1 € = 10 points) débloquant des soins offerts.

### 11. Formulaire de Contact & Newsletter
- Formulaire de demande client avec sélection du motif (dermatologie, suivi, INCI, retours).
- Inscription newsletter avec affichage immédiat du coupon de réduction.

---

## ⚡ Connexion Backend Cloud Supabase

Le projet est entièrement connecté au backend cloud **Supabase** via le SDK officiel `@supabase/supabase-js` et notre module [`assets/js/supabase-client.js`](assets/js/supabase-client.js).

### Informations du Projet Supabase
- **Projet ID** : `xqrvcalstmxzmpfzmbfq`
- **Région** : `eu-west-1`
- **Statut** : `ACTIVE_HEALTHY`
- **URL API** : `https://xqrvcalstmxzmpfzmbfq.supabase.co`

### Tables Synchronisées dans le Cloud
| Table | Description | Droits & RLS |
| :--- | :--- | :--- |
| **`products`** | Catalogue complet des 8 soins botaniques avec prix, stock, badges et descriptions. | Lecture publique (SELECT) & synchronisation |
| **`orders`** | Enregistrement de chaque commande passée (ID, client, adresse, panier, montant, paiement). | Insertion & consultation client |
| **`newsletter_subscribers`** | Collecte des adresses e-mails inscrites au club et provenance. | Insertion sécurisée sans doublons |
| **`contact_messages`** | Réception de tous les messages envoyés depuis le formulaire de contact. | Insertion publique |
| **`quiz_diagnoses`** | Sauvegarde des profils cutanés et routines générées par le diagnostic. | Insertion publique |

### Badge de Statut en Direct
Un indicateur dynamique situé dans le pied de page confirme la liaison en temps réel :
> `● Supabase Cloud Sync : Actif (XX ms)`

---

## 📂 Architecture & Structure des Fichiers

```text
siti daniel/
├── index.html                   # Page d'accueil et structure complète de la boutique
├── server.js                    # Serveur local Node.js avec gestion des types MIME
├── README.md                    # Documentation complète du projet
├── .gitignore                   # Fichiers et dossiers exclus du versionnement
│
├── assets/
│   ├── css/
│   │   ├── main.css             # Tokens de design, variables, typographie & resets
│   │   ├── components.css       # Styles de tous les composants, modales et drawer
│   │   └── animations.css       # Micro-animations, keyframes et transitions
│   │
│   ├── js/
│   │   ├── supabase-client.js   # Service d'intégration et synchronisation cloud Supabase
│   │   ├── data.js              # Données statiques de référence (produits, quiz, FAQ, blog)
│   │   ├── store.js             # Gestionnaire d'état réactif (panier, wishlist, commandes)
│   │   ├── quiz.js              # Moteur interactif du diagnostic de peau
│   │   ├── chatbot.js           # Conseillère beauté virtuelle et moteur conversationnel
│   │   ├── checkout.js          # Logique du tunnel de commande en 3 étapes & paiement
│   │   └── app.js               # Contrôleur applicatif principal, écouteurs et navigation
│   │
│   └── images/                  # Photographies et visuels des produits haute résolution
│       ├── oddaworld_hero_model_*.jpg
│       ├── oddaworld_cleanser_*.jpg
│       ├── oddaworld_serum_*.jpg
│       ├── oddaworld_moisturizer_*.jpg
│       ├── oddaworld_sunscreen_*.jpg
│       ├── oddaworld_facemask_*.jpg
│       └── oddaworld_mockup.jpg
```

---

## 💻 Installation & Démarrage Local

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Lancement en 2 étapes
1. Clonez le dépôt GitHub (ou placez-vous dans le répertoire du projet) :
   ```bash
   git clone https://github.com/informatiquedaniele-maker/cosmetique-.git
   cd cosmetique-
   ```

2. Démarrez le serveur local :
   ```bash
   node server.js
   ```

3. Ouvrez votre navigateur sur :
   ```text
   http://localhost:3000/
   ```

*(Alternative sans Node.js : vous pouvez ouvrir directement le fichier `index.html` dans n'importe quel navigateur).*

---

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5 sémantique, CSS3 moderne (Variables CSS, Flexbox, Grid, Glassmorphism, animations fluides), JavaScript Vanilla (ES6+ Classes).
- **Backend & Données** : Supabase (PostgreSQL 17, PostgREST API, Row Level Security).
- **Cartographie & GPS** : API de géolocalisation native HTML5 & Google Maps URL scheme.
- **Typographies** : Google Fonts (*Playfair Display*, *Outfit*, *Caveat*).
- **Hébergement & Versioning** : Git & GitHub.

---

## 🔄 Synchronisation GitHub & Déploiement

Le code source est versionné sur le dépôt distant officiel :
- **Dépôt** : `https://github.com/informatiquedaniele-maker/cosmetique-.git`
- **Branche principale** : `main`

Pour pousser de nouvelles modifications :
```bash
git add .
git commit -m "votre message"
git push origin main
```

---

*Développé avec passion pour **ODDAWORLD Cosmetics Paris** — Clean. Effective. Conscious.*
