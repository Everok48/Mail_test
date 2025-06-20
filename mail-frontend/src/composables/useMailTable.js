import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

export function useMailTable(endpoint) {
  const mails = ref([])
  const searchText = ref('')
  const $q = useQuasar()

  const filteredMails = computed(() => {
    if (!searchText.value) return mails.value
    const search = searchText.value.toLowerCase()
    return mails.value.filter(
      mail =>
        mail.toEmail?.toLowerCase().includes(search) ||
        mail.subject?.toLowerCase().includes(search) ||
        mail.body?.toLowerCase().includes(search)
    )
  })

  async function loadMails() {
    try {
      const response = await api.get(endpoint)
      mails.value = response.data
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить письма',
        caption: error.response?.data?.message || error.message,
        icon: 'warning',
        timeout: 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    }
  }

  onMounted(() => {
    loadMails()
  })

  return {
    mails,
    searchText,
    filteredMails,
    loadMails,
  }
}
