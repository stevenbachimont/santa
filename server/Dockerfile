# Étape 1 : Construire l'application Express
FROM node:16

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tous les fichiers du serveur Express
COPY . .

# Exposer le port 5001
EXPOSE 5001

# Lancer le serveur Express
CMD ["npm", "start"]
