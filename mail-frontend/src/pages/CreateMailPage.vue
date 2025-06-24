<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 700px">
      <h1 class="text-h5 q-mb-md">Новое письмо</h1>
      <q-card flat bordered class="q-pa-md">
        <q-form @submit.prevent="sendMail" ref="mailForm" class="q-gutter-md">
          <q-input
            outlined
            v-model="mail.fromEmail"
            label="От кого"
            clearable
            :rules="[
              val => !!val || 'Поле не может быть пустым',
              val => /.+@.+\..+/.test(val) || 'Введите корректный email',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="mail.toEmail"
            label="Кому"
            clearable
            :rules="[
              val => !!val || 'Поле не может быть пустым',
              val => /.+@.+\..+/.test(val) || 'Введите корректный email',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email" />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="mail.subject"
            label="Тема"
            clearable
            :rules="[val => !!val || 'Тема не может быть пустой']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>

          <q-input outlined v-model="mail.body" type="textarea" label="Текст письма" rows="10" />

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
  const mailForm = ref(null)

  const mail = ref({
    fromEmail: '',
    toEmail: '',
    subject: '',
    body: '',
    date: '',
    type: 'draft',
  })

  async function sendMail() {
    const success = await mailForm.value.validate()
    if (!success) {
      $q.notify({
        type: 'warning',
        position: 'top',
        message: 'Пожалуйста, заполните все обязательные поля корректно',
        timeout: 2000,
      })
      return
    }
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
      handleError(error, 'Не удалось отправить письмо')
    }
  }

  async function saveDraft() {
    const success = await mailForm.value.validate()
    if (!success) {
      $q.notify({
        type: 'warning',
        position: 'top',
        message: 'Пожалуйста, заполните все обязательные поля корректно',
        timeout: 2000,
      })
      return
    }
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
      handleError(error, 'Не удалось сохранить черновик')
    }
  }

  function goBack() {
    router.back()
  }

  function handleError(error, defaultMessage) {
    let message = defaultMessage
    if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
      message = error.response.data.message.join(', ')
    } else if (error.message) {
      message = error.message
    }
    $q.notify({
      type: 'negative',
      position: 'top',
      message: message,
      timeout: 3000,
    })
  }
</script>

<style scoped></style>
