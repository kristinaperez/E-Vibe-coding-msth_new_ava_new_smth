# Выделяйся — аватарки для соцсетей

Статичный сайт: загрузите фото, получите аватарку в едином стиле для Threads, ВКонтакте, Макс, LinkedIn, Facebook и Instagram. Фото обрабатывается в браузере и никуда не отправляется.

## Запуск локально
Откройте `index.html` в браузере или выполните `npx serve .`.

## Деплой
Vercel → импорт репозитория, без сборки (статичный проект из корня).

## Вход через Threads (подарки)
Переменные окружения в Vercel (Production), в код не попадают:
- `THREADS_APP_ID` — App ID приложения Threads.
- `THREADS_APP_SECRET` — секрет приложения Threads.
- `THREADS_REDIRECT_URI` — адрес `https://<домен>/api/threads/callback`, он же должен быть указан в настройках приложения Meta.
- `SESSION_SECRET` — случайная строка для подписи cookie.

Пока приложение не прошло App Review, войти могут только тестировщики Threads (App Dashboard → Roles → Threads Tester).
