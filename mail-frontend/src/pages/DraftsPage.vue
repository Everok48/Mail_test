<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Черновики</h1>
      <q-btn class="green-btn" label="Создать черновик" to="/create" />
    </div>
    <div class="search-row">
      <q-input
        class="search-inp"
        filled
        dense
        placeholder="Поиск по черновикам..."
        v-model="searchText"
      />
    </div>
    <q-table
      :rows="filteredMails"
      :columns="columns"
      class="big-table"
      hide-bottom
      row-key="id"
      :rows-per-page="0"
      @row-click="openMail"
    />
    <q-dialog v-model="dialogOpen">
      <MailDialog v-if="selectedMail" :mail="selectedMail" />
    </q-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { api } from 'src/boot/axios'
  import { useQuasar } from 'quasar'
  import { useMailTable } from 'src/composables/useMailTable'
  import MailDialog from 'components/MailDialog.vue'
  import { formatDate } from 'src/composables/useDateFormat'

  const drafts = ref([])
  const $q = useQuasar()

  const columns = [
    { name: 'toEmail', label: 'Кому', align: 'left', field: 'toEmail' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date', format: val => formatDate(val) },
    { name: 'body', label: 'Текст письма', align: 'left', field: 'body' },
  ]

  const { searchText, filteredMails } = useMailTable('/mails/drafts')

  const dialogOpen = ref(false)
  const selectedMail = ref(null)

  async function loadDrafts() {
    try {
      const response = await api.get('/mails/drafts')
      drafts.value = response.data
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить черновики',
        caption: error.response?.data?.message || error.message,
        icon: 'warning',
        timeout: 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    }
  }

  function openMail(evt, row) {
    selectedMail.value = row
    dialogOpen.value = true
  }

  onMounted(() => {
    loadDrafts()
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
  .big-table .q-tr {
    cursor: pointer;
  }
</style>
