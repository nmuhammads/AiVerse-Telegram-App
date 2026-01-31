# Development Guide

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/your-username/AiVerse-Telegram-App.git
cd AiVerse-Telegram-App
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your keys

# 3. Run development server
npm run dev
```

---

## Workspaces

| Package | Path | Description |
|---------|------|-------------|
| `@aiverse/telegram` | `apps/telegram/` | Telegram Mini App (Vite + React) |
| `@aiverse/mobile` | `apps/mobile/` | Mobile App (Expo + React Native) |
| `@aiverse/shared` | `packages/shared/` | Shared code (stores, types, i18n) |
| API | `api/` | Express backend |

---

## Development Commands

### Backend + Frontend (unified)
```bash
npm run dev           # Start dev server on :3000
npm run build         # Build for production
```

### Telegram Mini App
```bash
cd apps/telegram
npm run dev           # Vite dev server on :5173
npm run build         # Production build → dist/
npm run lint          # ESLint
```

### Mobile App
```bash
cd apps/mobile
npx expo start        # Start Expo dev server
# Нажмите 'a' для запуска на Android

# Для нативной сборки Android:
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"  # Windows
npx expo run:android  # Run on Android

npx expo run:ios      # Run on iOS (requires Xcode, macOS only)
```

> **Примечание:** Для Android требуется установленный Android Studio с JBR (Java 21).
> Подробные инструкции: [`apps/mobile/BUILD_INSTRUCTIONS.md`](apps/mobile/BUILD_INSTRUCTIONS.md)

### Shared Package
```bash
cd packages/shared
# No build needed — TypeScript source used directly
```

---

## Project Structure

```
├── api/                    # Express backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   ├── piapiService.ts # PIAPI integration
│   │   └── supabaseAdmin.ts # Supabase client
│   └── server.ts           # Entry point
│
├── apps/telegram/          # Telegram Mini App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores (local)
│   │   └── i18n.ts         # i18next config
│   └── public/locales/     # Translations
│
├── apps/mobile/            # React Native App
│   ├── App.tsx             # Entry point
│   └── package.json
│
└── packages/shared/        # Shared code
    ├── stores/             # Zustand stores
    ├── types/              # TypeScript interfaces
    └── i18n/               # Shared translations
```

---

## Environment Variables

### Required
```env
PIAPI_KEY=              # PIAPI API key
SUPABASE_URL=           # Supabase project URL
SUPABASE_KEY=           # Supabase service role key
TELEGRAM_BOT_TOKEN=     # Telegram bot token
```

### Optional
```env
WEBHOOK_URL=            # Telegram webhook URL
WEBAPP_URL=             # Web app URL for callbacks
CLOUDFLARE_BASE_URL=    # CDN base URL
PORT=3000               # Server port
NODE_ENV=development    # Environment
```

---

## Deployment

### Railway (Production)

1. Connect GitHub repo to Railway
2. Set env variables in Railway Dashboard
3. Deploy triggers automatically on push to main

Config files:
- `Dockerfile` — Production build
- `railway.json` — Railway settings

### Local Docker

```bash
docker build -t aiverse .
docker run -p 3000:3000 --env-file .env aiverse
```

---

## API Integration

### AI Generation (PIAPI)
- Models: NanoBanana, NanoBanana Pro, SeeDream 4/4.5, GPT Image, Qwen, Kling
- Service: `api/services/piapiService.ts`
- Controller: `api/controllers/generationController.ts`

### Database (Supabase)
- Tables: `users`, `generations`, `contests`, `contest_entries`
- Service: `api/services/supabaseAdmin.ts`
- Schema: `SQLSCHEME.sql`

---

## Testing

```bash
# API health check
curl http://localhost:3000/api/health

# Telegram Mini App (local)
# Use ngrok to expose localhost for Telegram testing
ngrok http 3000
```

---

## Useful Links

- [PIAPI Docs](https://piapi.ai/docs)
- [Supabase Dashboard](https://supabase.com)
- [Railway Dashboard](https://railway.app)
- [Expo Docs](https://docs.expo.dev)
