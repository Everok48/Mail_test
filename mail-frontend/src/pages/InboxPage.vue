<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Входящие</h1>
      <q-btn class="blue-btn" label="Получить новые письма" />
      <q-btn class="green-btn" label="Отправить письмо" to="/compose" />
    </div>
    <div class="search-row">
      <q-input class="search-inp" filled dense placeholder="Поиск по письмам..." />
    </div>
    <q-table
      :rows="[]"
      :columns="columns"
      class="big-table"
      hide-bottom
    />
  </div>
</template>

<script setup>
const columns = [
  { name: 'from', label: 'От кого', align: 'left', field: 'from' },
  { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
  { name: 'date', label: 'Дата', align: 'left', field: 'date' },
  { name: 'body', label: 'Текст письма', align: 'left', field: 'body' }
]
</script>

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
.blue-btn {
  background: #1976d2;
  color: #fff;
  border-radius: 5px;
  margin-right: 8px;
}
.green-btn {
  background: #43a047;
  color: #fff;
  border-radius: 5px;
}
.search-row {
  margin: 16px 0;
}
.search-inp {
  width: 250px;
}
.big-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}
</style> 