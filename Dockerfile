# Utiliser une image alpine avec Node.js
# Spécifier la version de Node.js que vous voulez utiliser
# Si possible, optez pour une version LTS pour une meilleure stabilité
FROM node:20-alpine

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Activer corepack et préparer pnpm
RUN corepack enable && \
    corepack prepare --activate pnpm@latest && \
    pnpm config -g set store-dir /.pnpm-store

# Copier les fichiers package.json et package-lock.json pour le client et le serveur
COPY --link ./client/package.json ./client/
COPY --link ./server/package.json ./server/

# Installer les dépendances pour le client et le serveur
RUN cd client && pnpm install
RUN cd server && pnpm install

# Copier le reste des fichiers du client et du serveur
COPY ./client ./client
COPY ./server ./server

# Exposer les ports utilisés par votre application
EXPOSE 3333 5001

# Commande par défaut pour lancer l'application
# Assurez-vous que le client et le serveur démarrent de manière parallèle
CMD ["sh", "-c", "cd client && pnpm run dev & cd server && pnpm start"]
