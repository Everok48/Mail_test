<template>
  <LoginLayout>
    <q-page class="flex flex-center">
      <q-card style="min-width: 350px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6 text-center">Вход в почту</div>
        </q-card-section>
        <q-form @submit.prevent="onLogin">
          <q-card-section>
            <q-input v-model="email" label="Email" type="email" required autofocus />
            <q-input v-model="password" label="Пароль" type="password" required />
            <q-banner v-if="error" class="q-mt-md" dense color="negative" icon="error">
              {{ error }}
            </q-banner>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Войти" type="submit" color="primary" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-page>
  </LoginLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import LoginLayout from 'layouts/LoginLayout.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const onLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
