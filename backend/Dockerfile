# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia todo o código fonte
COPY . .

# Build do projeto
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]