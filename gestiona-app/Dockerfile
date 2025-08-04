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

# ✅ Corrigido: copia o build final
COPY --from=builder /app/dist/gestiona-app/browser /usr/share/nginx/html
#COPY --from=builder /app/dist/gestiona-app /usr/share/nginx/html
