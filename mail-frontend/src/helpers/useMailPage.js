import { ref, computed, watch } from 'vue'
import { useMailStore } from 'src/stores/mail-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { formatDate } from 'src/helpers/useDateFormat'

const pageConfigs = {
  inbox: {
    title: 'Входящие',
    icon: 'inbox',
    columns: [
      {
        name: 'fromEmail',
        label: 'Отправитель',
        field: 'fromEmail',
        align: 'left',
        style: 'width: 250px',
      },
      { name: 'subject', label: 'Тема', field: 'subject', align: 'left' },
      {
        name: 'date',
        label: 'Дата',
        field: 'date',
        format: val => formatDate(val),
        align: 'right',
        style: 'width: 150px',
      },
    ],
  },
  sent: {
    title: 'Отправленные',
    icon: 'send',
    columns: [
      {
        name: 'toEmail',
        label: 'Получатель',
        field: 'toEmail',
        align: 'left',
        style: 'width: 250px',
      },
      { name: 'subject', label: 'Тема', field: 'subject', align: 'left' },
      {
        name: 'date',
        label: 'Дата',
        field: 'date',
        format: val => formatDate(val),
        align: 'right',
        style: 'width: 150px',
      },
    ],
  },
  drafts: {
    title: 'Черновики',
    icon: 'edit_note',
    columns: [
      {
        name: 'toEmail',
        label: 'Кому (черновик)',
        field: 'toEmail',
        align: 'left',
        style: 'width: 250px',
      },
      { name: 'subject', label: 'Тема', field: 'subject', align: 'left' },
      {
        name: 'date',
        label: 'Дата',
        field: 'date',
        format: val => formatDate(val),
        align: 'right',
        style: 'width: 150px',
      },
    ],
  },
}

export function useMailPage(mailType) {
  const mailStore = useMailStore()
  const { isLoading, error } = storeToRefs(mailStore)
  const $q = useQuasar()

  const showMailDialog = ref(false)
  const currentMail = ref(null)

  const config = computed(() => pageConfigs[mailType])
  const columns = computed(() => config.value.columns)
  const filteredMails = computed(() => mailStore.filteredMailsByType(mailType))

  const searchQuery = computed({
    get: () => mailStore.filters.searchQuery,
    set: value => mailStore.updateFilters({ searchQuery: value }),
  })

  const loadMails = async () => {
    try {
      if (mailType === 'inbox') {
        // Сначала сгенерировать новые входящие письма
        await fetch('/api/mails/fake-incoming', { method: 'POST' })
      }
      await mailStore.fetchMails(mailType)
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письма успешно загружены',
        timeout: 2000,
      })
    } catch (err) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить письма',
        caption: err.message,
        timeout: 3000,
      })
    }
  }

  const openMail = (evt, mail) => {
    currentMail.value = mail
    showMailDialog.value = true
  }

  const closeMailDialog = () => {
    showMailDialog.value = false
    currentMail.value = null
  }

  const handleDelete = async id => {
    try {
      await mailStore.deleteMail(id, mailType)
      showMailDialog.value = false
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письмо удалено',
        timeout: 2000,
      })
    } catch (err) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось удалить письмо',
        caption: err.message,
        timeout: 3000,
      })
    }
  }

  watch(() => mailType, loadMails, { immediate: true })

  return {
    isLoading,
    error,
    showMailDialog,
    currentMail,
    config,
    columns,
    filteredMails,
    searchQuery,
    loadMails,
    openMail,
    closeMailDialog,
    handleDelete,
  }
}
