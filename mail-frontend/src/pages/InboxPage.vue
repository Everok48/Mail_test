<template>
  <div class="big-box">
    <div class="top-row">
      <h1 class="main-title">Входящие</h1>
      <q-btn class="blue-btn" label="Получить новые письма" @click="loadMails" />
      <q-btn class="green-btn" label="Отправить письмо" to="/create" />
    </div>
    <div class="search-row">
      <q-input
        class="search-inp"
        filled
        dense
        placeholder="Поиск по письмам..."
        v-model="searchText"
      />
    </div>
    <q-table
      :rows="filteredMails"
      :columns="columns"
      class="big-table"
      hide-bottom
      row-key="id"
      :rows-per-page="10"
      @row-click="openMail"
    />
    <q-dialog v-model="dialogOpen">
      <MailDialog v-if="selectedMail" :mail="selectedMail" />
    </q-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useQuasar } from 'quasar'
  import { useMailTable } from 'src/composables/useMailTable'
  import MailDialog from 'components/MailDialog.vue'
  import { formatDate } from 'src/composables/useDateFormat'

  const columns = [
    { name: 'fromEmail', label: 'От кого', align: 'left', field: 'fromEmail' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date', format: val => formatDate(val) },
    { name: 'body', label: 'Текст письма', align: 'left', field: 'body' },
  ]

  const { searchText, filteredMails, loadMails } = useMailTable('/mails/inbox')

  const $q = useQuasar()
  const dialogOpen = ref(false)
  const selectedMail = ref(null)

  function openMail(evt, row) {
    selectedMail.value = row
    dialogOpen.value = true
  }
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
  /* Делаем строки таблицы кликабельными */
  .big-table .q-tr {
    cursor: pointer;
  }
</style>
