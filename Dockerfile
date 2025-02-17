# Utiliser une image Node.js comme base
FROM node:22.11-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Construire l'application Angular
RUN npm run build --prod

# Utiliser une image Nginx pour servir l'application
FROM nginx:1.26-alpine3.20-perl

# Copier la configuration Nginx personnalisée
COPY /config/nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers de construction d'Angular dans le dossier de Nginx
COPY --from=build /app/dist/jeuxolympiques/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
