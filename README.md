# Тестовое почтовое приложение (Quasar + NestJS)

Данные для входа
Email: test@mail.ru
Пароль: 123456

Backend (NestJS):
cd mail-backend
npm install
npm start

```
Сервер будет доступен по адресу: http://localhost:3000

---

Frontend (Quasar)
cd mail-frontend
npm install
quasar dev
```

Приложение будет доступно по адресу: http://localhost:9000

Функционал

Входящие, отправленные, черновики — просмотр, поиск, фильтрация, сортировка по дате
Создание и отправка писем
Редактирование и отправка черновиков
Удаление писем и черновиков
Мгновенное обновление списков после действий
Поиск по теме, отправителю, тексту письма
Уведомления о действиях и ошибках

---

Стек

- Бэкенд: NestJS, better-sqlite3, faker.js, JWT

- Фронтенд: Quasar (Vue 3, Pinia, Vue Router, Axios)

- Прочее: Axios, ESLint, Prettier
