# Etapa 1: Build da aplicação Angular
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install && npx ng build --configuration production

# Etapa 2: NGINX para servir os arquivos estáticos
FROM nginx:1.25-alpine

# Remove a configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nova configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ Copia os arquivos de build corretos (browser)
COPY --from=builder /app/dist/gestiona-app/browser/consulta-creditos /usr/share/nginx/html
