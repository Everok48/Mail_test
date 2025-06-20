<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Новое письмо</h1>
    </div>
    <div class="form-box">
      <div class="form-row">
        <span class="form-label">От кого:</span>
        <q-input
          v-model="mail.fromEmail"
          class="form-input"
          filled
          dense
          placeholder="Введите ваш email"
        />
      </div>
      <div class="form-row">
        <span class="form-label">Кому:</span>
        <q-input
          v-model="mail.toEmail"
          class="form-input"
          filled
          dense
          placeholder="Введите email получателя"
        />
      </div>
      <div class="form-row">
        <span class="form-label">Тема:</span>
        <q-input
          v-model="mail.subject"
          class="form-input"
          filled
          dense
          placeholder="Введите тему письма"
        />
      </div>
      <div class="form-row">
        <span class="form-label">Текст:</span>
        <q-input
          v-model="mail.body"
          class="form-textarea"
          filled
          type="textarea"
          placeholder="Введите текст письма"
          rows="10"
        />
      </div>
      <div class="btns-row">
        <q-btn class="green-btn" label="Отправить" @click="sendMail" />
        <q-btn class="blue-btn" label="Сохранить в черновики" @click="saveDraft" />
        <q-btn class="grey-btn" label="Назад" @click="goBack" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { api } from 'src/boot/axios'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const mail = ref({
    fromEmail: '',
    toEmail: '',
    subject: '',
    body: '',
    date: '',
    isDraft: false,
    isSent: false,
    type: 'inbox',
  })

  async function sendMail() {
    try {
      mail.value.isDraft = false
      mail.value.isSent = true
      mail.value.type = 'sent'
      mail.value.date = new Date().toISOString()
      await api.post('/mails', mail.value)
      router.push('/sent')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось отправить письма',
        caption: error.response?.data?.message || error.message,
        icon: 'warning',
        timeout: 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    }
  }

  async function saveDraft() {
    try {
      mail.value.isDraft = true
      mail.value.isSent = false
      mail.value.type = 'draft'
      mail.value.date = new Date().toISOString()
      await api.post('/mails', mail.value)
      router.push('/drafts')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось сохранить черновик',
        caption: error.response?.data?.message || error.message,
        icon: 'warning',
        timeout: 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    }
  }

  function goBack() {
    router.back()
  }
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
