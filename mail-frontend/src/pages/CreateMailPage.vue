<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 700px">
      <h1 class="text-h5 q-mb-md">Новое письмо</h1>
      <q-card flat bordered class="q-pa-md">
        <q-form @submit.prevent="sendMail">
          <q-input outlined v-model="mail.fromEmail" label="От кого" class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input outlined v-model="mail.toEmail" label="Кому" class="q-mb-md" clearable>
            <template v-slot:prepend>
              <q-icon name="alternate_email" />
            </template>
          </q-input>

          <q-input outlined v-model="mail.subject" label="Тема" class="q-mb-md" clearable>
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="mail.body"
            type="textarea"
            label="Текст письма"
            rows="10"
            class="q-mb-lg"
          />

          <div class="row q-gutter-sm justify-end">
            <q-btn icon="arrow_back" label="Назад" color="grey" flat @click="goBack" />
            <q-btn
              icon="drafts"
              label="Сохранить в черновики"
              color="primary"
              outline
              @click="saveDraft"
            />
            <q-btn icon="send" label="Отправить" color="primary" type="submit" />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
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

<style scoped></style>
