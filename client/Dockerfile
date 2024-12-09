# Étape 1 : Build de l'application React
FROM node:16 AS build

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tous les fichiers et construire l'application
COPY . .
RUN npm run dev

# Étape 2 : Serveur Nginx pour servir l'application React
FROM nginx:alpine

# Copier les fichiers buildés dans le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 3333
EXPOSE 3333

CMD ["nginx", "-g", "daemon off;"]
