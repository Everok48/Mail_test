<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Просмотр письма</h1>
      <q-btn class="red-btn" label="Удалить" />
      <q-btn class="blue-btn" label="Назад" to="/inbox" />
    </div>
    <div class="mail-box">
      <div class="mail-row">
        <span class="mail-label">От кого:</span>
        <span class="mail-text">Иван Иванов</span>
      </div>
      <div class="mail-row">
        <span class="mail-label">Кому:</span>
        <span class="mail-text">Петр Петров</span>
      </div>
      <div class="mail-row">
        <span class="mail-label">Тема:</span>
        <span class="mail-text">Важное письмо</span>
      </div>
      <div class="mail-row">
        <span class="mail-label">Дата:</span>
        <span class="mail-text">01.01.2024</span>
      </div>
      <div class="mail-content">
        <p>Текст письма будет здесь...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.big-box {
  max-width: 1100px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
}
.top-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.main-title {
  font-size: 22px;
  margin-right: 20px;
}
.red-btn {
  background: #d32f2f;
  color: #fff;
  border-radius: 5px;
  margin-right: 8px;
}
.blue-btn {
  background: #1976d2;
  color: #fff;
  border-radius: 5px;
}
.mail-box {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
.mail-row {
  margin-bottom: 15px;
}
.mail-label {
  font-weight: bold;
  margin-right: 10px;
  color: #666;
}
.mail-text {
  color: #333;
}
.mail-content {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style> 