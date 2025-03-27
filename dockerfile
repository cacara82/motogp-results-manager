# Usar una imagen de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en la raíz del proyecto
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Exponer el puerto de Vite (5173 por defecto)
EXPOSE 5173

# Ejecutar Vite en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
