<template>
  <q-card class="mail-dialog-card">
    <q-card-section>
      <div class="mail-dialog-title">{{ mail.subject }}</div>
      <div class="mail-dialog-info">
        <div><b>От кого:</b> {{ mail.fromEmail }}</div>
        <div><b>Кому:</b> {{ mail.toEmail }}</div>
        <div><b>Дата:</b> {{ formatDate(mail.date) }}</div>
      </div>
      <div class="mail-dialog-body">
        <b>Текст письма:</b>
        <div>{{ mail.body }}</div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Закрыть" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { formatDate } from 'src/composables/useDateFormat'
  defineProps({
    mail: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped>
  .mail-dialog-card {
    min-width: 350px;
    max-width: 500px;
  }
  .mail-dialog-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .mail-dialog-info {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .mail-dialog-body {
    margin-top: 10px;
    font-size: 16px;
  }
</style>
