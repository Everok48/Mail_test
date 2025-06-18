<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Новое письмо</h1>
    </div>
    <div class="form-box">
      <div class="form-row">
        <span class="form-label">Кому:</span>
        <q-input class="form-input" filled dense placeholder="Введите email получателя" />
      </div>
      <div class="form-row">
        <span class="form-label">Тема:</span>
        <q-input class="form-input" filled dense placeholder="Введите тему письма" />
      </div>
      <div class="form-row">
        <span class="form-label">Текст:</span>
        <q-input class="form-textarea" filled type="textarea" placeholder="Введите текст письма" rows="10" />
      </div>
      <div class="btns-row">
        <q-btn class="green-btn" label="Отправить" />
        <q-btn class="blue-btn" label="Сохранить в черновики" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.big-box {
  max-width: 600px;
  margin: 32px auto;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
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
.green-btn {
  background: #43a047;
  color: #fff;
  border-radius: 5px;
  margin-right: 8px;
}
.blue-btn {
  background: #1976d2;
  color: #fff;
  border-radius: 5px;
}
.form-box {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
.form-row {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #666;
}
.form-input {
  width: 100%;
}
.form-textarea {
  width: 100%;
}
.btns-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style> 