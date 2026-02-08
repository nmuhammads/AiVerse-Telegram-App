# Deeplinks AiVerse

Все deeplinks используются в формате:
```
https://t.me/AiVerseAppBot?startapp={deeplink}
```

## Навигация

| Deeplink | Описание | Страница |
|----------|----------|----------|
| `home` | Главная страница (лента) | `/` |
| `studio` или `generate` | Студия генерации | `/studio` |
| `chat` | Студия в режиме чата с ИИ | `/studio?mode=chat` |
| `top` | Рейтинг/Лидерборд | `/top` |
| `profile` | Профиль пользователя | `/profile` |
| `settings` | Настройки | `/settings` |
| `accumulations` | Накопления | `/accumulations` |
| `events` или `contests` | События/Конкурсы | `/events` |
| `spin` или `fortune` | Колесо фортуны | `/spin` |

## Динамические

| Формат | Описание | Пример |
|--------|----------|--------|
| `contest-{id}` | Конкретный конкурс | `contest-123` |
| `profile-{userId}` | Профиль пользователя по ID | `profile-817308975` |
| `ref-{username}` | Реферальная ссылка | `ref-mortymn` |
| `ref-{username}-remix-{id}` | Реферальная ссылка с ремиксом | `ref-mortymn-remix-456` |
| `remix-{id}` | Ремикс генерации | `remix-123` |

---

## Студия — Модели фото

| Deeplink | Модель |
|----------|--------|
| `studio-nanobanana` | NanoBanana |
| `studio-nanobanana-pro` | NanoBanana Pro |
| `studio-seedream4` | Seedream 4 |
| `studio-seedream4-5` | Seedream 4.5 |
| `studio-gpt-image-1.5` | GPT Image 1.5 |
| `studio-qwen-image` | Qwen Image |

## Студия — Модели видео

| Deeplink | Модель | Режим |
|----------|--------|-------|
| `studio-seedance-t2v` | Seedance Pro | Text to Video |
| `studio-seedance-i2v` | Seedance Pro | Image to Video |
| `studio-kling-t2v` | Kling | Text to Video |
| `studio-kling-i2v` | Kling | Image to Video |
| `studio-kling-mc` | Kling Motion Control | Motion Control |

## Альтернативные форматы

Можно использовать префиксы `photo-` и `video-` для явного указания типа медиа:

| Формат | Описание |
|--------|----------|
| `photo-{model}` | Фото режим с указанной моделью |
| `video-{model}` | Видео режим с указанной моделью |

---

## Примеры полных ссылок

```
# Открыть студию с NanoBanana Pro
https://t.me/AiVerseAppBot?startapp=studio-nanobanana-pro

# Открыть Kling I2V
https://t.me/AiVerseAppBot?startapp=studio-kling-i2v

# Реферальная ссылка
https://t.me/AiVerseAppBot?startapp=ref-mortymn

# Открыть конкурс
https://t.me/AiVerseAppBot?startapp=contest-123
```
