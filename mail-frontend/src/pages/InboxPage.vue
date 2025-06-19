<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Входящие</h1>
      <q-btn class="blue-btn" label="Получить новые письма" @click="loadMails" />
      <q-btn class="green-btn" label="Отправить письмо" to="/create" />
    </div>
    <div class="search-row">
      <q-input class="search-inp" filled dense placeholder="Поиск по письмам..." @click="filtere" />
    </div>
    <q-table
      :rows="filteredEmails"
      :columns="columns"
      class="big-table"
      hide-bottom
      @row-click="rowClick"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { api } from 'src/boot/axios'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'

  const mails = ref([])
  const searchText = ref('')
  const router = useRouter()
  const $q = useQuasar()

  const columns = [
    { name: 'fromEmail', label: 'От кого', align: 'left', field: 'from' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date' },
    { name: 'body', label: 'Текст письма', align: 'left', field: 'body' },
  ]

  const filteredEmails = computed(() => {
    if (!searchText.value) return mails.value
    const search = searchText.value.toLowerCase()
    return mails.value.filter(
      mail =>
        mail.fromEmail?.toLowerCase().includes(search) ||
        mail.subject?.toLowerCase().includes(search) ||
        mail.body?.toLowerCase().includes(search)
    )
  })

  async function loadMails() {
    try {
      const response = await api.get('/mails/inbox')
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

  function rowClick(e, row) {
    if (row?.id) {
      router.push('/mail' + row.id)
    }
  }

  onMounted(() => {
    loadMails()
  })
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
