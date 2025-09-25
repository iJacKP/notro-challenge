# Etapa 1: build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: servir com Nginx
FROM nginx:stable-alpine

# Remove config padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build Angular
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copia config customizada (opcional)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
