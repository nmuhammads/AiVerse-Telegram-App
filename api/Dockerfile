# Используем Node.js 22 LTS как базовый образ
FROM node:22-alpine

# Устанавливаем fontconfig и шрифты для поддержки кириллицы в водяных знаках
RUN apk add --no-cache fontconfig font-noto font-noto-cjk ttf-dejavu ffmpeg \
    && fc-cache -fv

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Компилируем TypeScript
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start"]
