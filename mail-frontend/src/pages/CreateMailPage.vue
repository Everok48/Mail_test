<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 700px">
      <h1 class="text-h5 q-mb-md">Новое письмо</h1>
      <q-card flat bordered class="q-pa-md">
        <q-form @submit.prevent="sendMail">
          <q-input outlined v-model="mail.fromEmail" label="От кого" class="q-mb-md" clearable>
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
  import { useRouter } from 'vue-router'
  import { useMailStore } from 'src/stores/mail-store'
  import { useQuasar } from 'quasar'

  const router = useRouter()
  const mailStore = useMailStore()
  const $q = useQuasar()

  const mail = ref({
    fromEmail: '',
    toEmail: '',
    subject: '',
    body: '',
    date: '',
    type: 'draft',
  })

  async function sendMail() {
    try {
      mail.value.date = new Date().toISOString()
      mail.value.type = 'sent'
      await mailStore.sendMail(mail.value)
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письмо успешно отправлено',
        timeout: 2000,
      })
      router.push('/sent')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось отправить письмо',
        caption: error.message,
        timeout: 3000,
      })
    }
  }

  async function saveDraft() {
    try {
      mail.value.date = new Date().toISOString()
      mail.value.type = 'draft'
      await mailStore.saveDraft(mail.value)
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Черновик успешно сохранен',
        timeout: 2000,
      })
      router.push('/drafts')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось сохранить черновик',
        caption: error.message,
        timeout: 3000,
      })
    }
  }

  function goBack() {
    router.back()
  }
</script>

<style scoped></style>
