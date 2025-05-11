# Application de Vente de Billetterie - JO 2024

## Description

Cette application est une plateforme de vente de billetterie pour les Jeux Olympiques de 2024, développée dans le cadre de mes études chez Studi. L'application permet à un utilisateur de s'inscrire, se connecter et acheter des billets pour différents événements des JO 2024. Un espace admin est également prévu pour gérer les événements et les offres.

## Liens du projet 
- **Front :** : https://jeuxolympiques.gregoryfulgueiras.com
- **API :** : https://api-jeuxolympiques.gregoryfulgueiras.com
    swagger : https://api-jeuxolympiques.gregoryfulgueiras.com/swagger-ui/index.html

## Fonctionnalités

### Visiteur
- **Inscription :** Un visiteur peut créer un compte en fournissant des informations personnelles (nom, prénnom, email, mot de passe).
- **Connexion :** Un visiteur peut se connecter à son compte existant.
- **Achat de billets :** Une fois connecté, un utilisateur peut sélectionner un événement et acheter des billets.

### Admin
- **Gestion des événements :** L'admin peut créer, modifier et supprimer des événements.
- **Gestion des offres :** L'admin peut créer, modifier et supprimer des offres.
- **Statistiques et rapports :** L'admin peut consulter des rapports sur les ventes de billets.

## Stack Technique

- **Front-end :** Angular 19.1.6 (avec Angular Material pour l'UI)
- **Back-end :** Spring Boot 3.4.3
- **Base de données :** PostgreSQL 17.4
- **Broker de message :** RabbitMQ 
- **Déploiement :** Heroku avec addons Heroku Postgres et CloudAMQP

## Prérequis

- Node.js v22.11.0
- Avoir installé l'API https://github.com/Y-rog/api-jeuxolympiques.git

## Installation

### Front-end (Angular)

1. Clonez le repository :
   ```bash
   git clone https://github.com/Y-rog/jeuxolympiques.git
   cd jeuxolympiques

2. Installez les dépendances :
    ```bash
    npm install

3. Lancez l'application :
    ```bash
    ng serve

4. Accèder l'application :
    ```bash
    http://localhost:4200
    ```

### Back-end (Srping Boot)

 - voir Readme de l'API https://github.com/Y-rog/api-jeuxolympiques.git

## Sécurité

 - Authentification via JWT, stocké en Session storage
 - Protection des routes (guard)
 - Validation des formulaires

## Ecolutions futures
 - **Statistiques :** Différentes stats serait intéressant pour le client par ex: les ventes par événements et ajout de graphique pour améliorer l'expérience utilisateur.
 - **Développemnt d'application mobile pour employé :**  une application mobile pour scanner les QrCode des billets.
 - **Notifications :** exemple ajout de notifications à l’approche des événements
 - **Gestion des SAV :** Par exemple pour des demandes de remboursements d'événements annulé.
 - **Optimiser les performances de l’application  :** Implémenter un système de cache pour les offres et événements les plus consultés ou populaires.