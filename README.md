# Abandoned Cart Integration (Hshop + SendPulse)

## 1. Deploy server
- Зарегистрируйтесь на [Render](https://render.com/)
- Создайте **New Web Service**
- Загрузите этот проект или подключите GitHub-репозиторий
- Render автоматически подтянет `render.yaml`
- В Environment Variables добавьте:
  - `SENDPULSE_ID` = ваш client_id
  - `SENDPULSE_SECRET` = ваш client_secret

## 2. Вставьте скрипт в Хорошоп
- В админке найдите раздел **Настройки → Вставка кода → Перед </body>**
- Вставьте содержимое `script.js`
- Замените `https://YOUR_RENDER_URL` на URL вашего Render сервиса

## 3. Настройка SendPulse
- В SendPulse создайте **событие** с названием `abandoned_cart`
- В Automation 360 создайте сценарий:
  - Триггер: событие `abandoned_cart`
  - Письмо: "Вы забыли товары в корзине"
  - Вставьте ссылку на корзину через переменную `{{cart_url}}`

Готово!
