import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const email = ref(localStorage.getItem('email') || '')
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  async function login(emailInput, password) {
    try {
      const res = await axios.post('/api/auth/login', { email: emailInput, password })
      token.value = res.data.access_token
      email.value = emailInput
      localStorage.setItem('token', token.value)
      localStorage.setItem('email', email.value)
      router.push('/')
    } catch (e) {
      logout()
      throw new Error('Неверный email или пароль')
    }
  }

  function logout() {
    token.value = ''
    email.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    router.push('/login')
  }

  return { token, email, isAuthenticated, login, logout }
})
