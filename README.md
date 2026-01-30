# AiVerse — AI Image & Video Generator

Монорепо проект для AI генерации изображений и видео. Telegram Mini App + React Native Mobile App с общим бэкендом.

## 🚀 Особенности

- 🎨 **Множество AI моделей**: NanoBanana, NanoBanana Pro, SeeDream 4/4.5, GPT Image 1.5, Qwen Image, Kling AI
- 📱 **Telegram Mini App**: Полная интеграция с Telegram SDK
- 📲 **Mobile App**: React Native (Expo) для iOS и Android
- 🎬 **Генерация видео**: Text-to-Video и Image-to-Video через Kling AI
- 🖼 **Лента работ**: Просмотр работ сообщества, лайки и ремиксы
- 🤖 **AI Chat**: Встроенный чат-ассистент для помощи с промптами
- 🏆 **Конкурсы**: Тематические соревнования и таблицы лидеров
- 🌓 **Адаптивный дизайн**: Современный UI с поддержкой тёмной темы

---

## 📁 Структура проекта

```
AiVerse-Telegram-App/
├── apps/
│   ├── telegram/           # React Web (Vite) — Telegram Mini App
│   │   ├── src/
│   │   │   ├── components/ # UI компоненты
│   │   │   ├── pages/      # Страницы (Studio, Feed, Profile, etc)
│   │   │   └── store/      # Zustand stores
│   │   └── public/         # Статика, локализации
│   │
│   └── mobile/             # React Native (Expo) — Mobile App
│       ├── App.tsx
│       └── package.json
│
├── packages/
│   └── shared/             # Общий код для обоих приложений
│       ├── stores/         # Zustand stores
│       ├── types/          # TypeScript типы
│       └── i18n/           # Локализации (ru, en)
│
├── api/                    # Express backend
│   ├── controllers/        # API контроллеры
│   ├── routes/             # Роуты
│   ├── services/           # Бизнес-логика (PIAPI, Supabase)
│   └── server.ts           # Entry point
│
├── pnpm-workspace.yaml     # Workspaces config
├── Dockerfile              # Production build
└── railway.json            # Railway deploy config
```

---

## 🛠 Технологический стек

### Frontend (Telegram Mini App)
- **Framework**: React 18, TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **i18n**: i18next
- **SDK**: @twa-dev/sdk, @telegram-apps/sdk

### Frontend (Mobile)
- **Framework**: React Native 0.81, Expo 54
- **Navigation**: Expo Router (в разработке)
- **State**: Zustand (shared)

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express 4
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **AI APIs**: PIAPI (NanoBanana, SeeDream, Kling)

### Infrastructure
- **Deploy**: Railway (unified service)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **CDN**: Cloudflare

---

## 🏗 Установка и запуск

### Требования

- Node.js 22+
- pnpm (npm или yarn тоже работают)
- Для Mobile: Expo CLI, Android Studio / Xcode

### 1. Клонирование

```bash
git clone https://github.com/your-username/AiVerse-Telegram-App.git
cd AiVerse-Telegram-App
```

### 2. Установка зависимостей

```bash
# Корневые зависимости
npm install

# Telegram Mini App
cd apps/telegram && npm install && cd ../..

# Mobile App
cd apps/mobile && npm install && cd ../..
```

### 3. Настройка окружения

```bash
cp .env.example .env
```

**Основные переменные:**
```env
# AI API
PIAPI_KEY=your_piapi_key

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
WEBAPP_URL=https://your-app.railway.app

# Server
PORT=3000
NODE_ENV=development
```

### 4. Запуск

```bash
# Backend + Frontend (unified)
npm run dev

# Только Telegram Mini App
cd apps/telegram && npm run dev

# Только Mobile App (Expo)
cd apps/mobile && npx expo start
```

---

## 📱 Сборка

### Telegram Mini App (Production)

```bash
cd apps/telegram
npm run build
# Output: apps/telegram/dist/
```

### Mobile App (Development Build)

```bash
cd apps/mobile

# Android
npx expo run:android

# iOS (требуется Mac + Xcode)
npx expo run:ios
```

### Docker (Backend + Frontend)

```bash
docker build -t aiverse .
docker run -p 3000:3000 --env-file .env aiverse
```

---

## 🚀 Деплой

### Railway (рекомендуется)

Проект настроен для деплоя на Railway одним сервисом:
- Используется `Dockerfile` в корне
- Backend раздаёт статику фронтенда
- Настройки в `railway.json`

```bash
railway up
```

### Переменные окружения Railway

Добавьте в Railway Dashboard:
- `PIAPI_KEY`
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`
- `WEBAPP_URL`
- `NODE_ENV=production`

---

## 📖 API Документация

### Основные эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/generation/generate` | Генерация изображения |
| POST | `/api/generation/video` | Генерация видео |
| GET | `/api/feed` | Лента публикаций |
| GET | `/api/user/:userId` | Профиль пользователя |
| POST | `/api/ai-chat` | AI Chat сообщение |

### Пример генерации

```bash
curl -X POST https://your-app.railway.app/api/generation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a beautiful sunset over mountains",
    "model": "seedream4",
    "aspect_ratio": "16:9",
    "user_id": 123456789
  }'
```

---

## 🗂 Roadmap

- [x] Фаза 0: Монорепо структура
- [x] Фаза 1: Shared packages + Mobile init
- [ ] Фаза 2: Mobile UI (Studio, Profile, Feed)
- [ ] Фаза 3: Supabase Auth
- [ ] Фаза 4: Backend адаптация
- [ ] Фаза 5: Push-уведомления
- [ ] Фаза 6: Публикация в App Store / Play Store

---

## 📄 Лицензия

MIT License

---

## 🔗 Ссылки

- [Telegram Mini App](https://t.me/aiverse_bot)
- [Railway Dashboard](https://railway.app)
- [Supabase Project](https://supabase.com)
