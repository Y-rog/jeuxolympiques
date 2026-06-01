# 🏅 Billetterie Jeux Olympiques — Front-end Angular

Application web de billetterie pour les Jeux Olympiques, développée en Angular 19.
Permet à un utilisateur de consulter les événements, acheter des billets et récupérer ses e-billets avec QR code.

## 🔗 Liens

| | URL |
|---|---|
| 🌐 Application | https://jeuxolympiques-kappa.vercel.app |
| ⚙️ API | https://web-production-acdd9.up.railway.app |
| 📖 Swagger | https://web-production-acdd9.up.railway.app/swagger-ui/index.html |
| 🔙 GitHub API | https://github.com/Y-rog/api-jeuxolympiques |

## 🧪 Compte de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | usertest@mail.com | Test123@ |

> 💡 Un compte admin est disponible sur demande pour les recruteurs.

## ✨ Fonctionnalités

### Visiteur
- Inscription et connexion
- Consultation des événements et offres disponibles

### Utilisateur connecté
- Ajout d'offres au panier
- Simulation de paiement
- Récupération des e-billets avec QR code unique

### Administrateur
- CRUD événements et offres
- Gestion de la disponibilité des offres
- Statistiques de ventes

## 🛠️ Stack technique

- **Framework :** Angular 19
- **UI :** Angular Material
- **Authentification :** JWT (sessionStorage)
- **Déploiement :** Vercel

## 🚀 Installation locale

### Prérequis
- Node.js v22+
- API backend lancée → voir [api-jeuxolympiques](https://github.com/Y-rog/api-jeuxolympiques)

### Étapes

```bash
git clone https://github.com/Y-rog/jeuxolympiques.git
cd jeuxolympiques
npm install
ng serve
```

Accès : `http://localhost:4200`

## 🔒 Sécurité
- Authentification JWT stocké en sessionStorage
- Protection des routes avec Guards Angular
- Validation des formulaires

## 🔮 Évolutions futures
- Notifications à l'approche des événements
- Application mobile pour scanner les QR codes
- Gestion des remboursements (SAV)
- Système de cache pour les performances
- Graphiques de statistiques pour l'admin

## 👤 Auteur
Grégory Fulgueiras — [Portfolio](https://y-rog.com) · [LinkedIn](https://www.linkedin.com/in/fulgueiras-grégory-887267136/)