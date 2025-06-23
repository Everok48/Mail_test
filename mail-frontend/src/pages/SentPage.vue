<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h5">Отправленные</h1>
      <q-btn icon="add" label="Новое письмо" color="primary" to="/create" />
    </div>

    <MailTable
      v-model="searchText"
      :rows="filteredMails"
      :columns="columns"
      :loading="isLoading"
      :noDataIcon="'send'"
      :noDataText="'Вы еще не отправляли писем'"
      :onRowClick="openMail"
    >
      <template #body-cell-subject="props">
        <q-td :props="props" class="cursor-pointer">
          <span class="text-weight-bold">{{ props.row.subject }}</span>
          <div class="text-grey-7 ellipsis">{{ props.row.body }}</div>
        </q-td>
      </template>
    </MailTable>

    <q-dialog v-model="dialogOpen">
      <MailDialog v-if="selectedMail" :mail="selectedMail" @delete="handleDelete" />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'
  import MailDialog from 'components/MailDialog.vue'
  import { formatDate } from 'src/composables/useDateFormat'
  import MailTable from 'components/MailTable.vue'
  import { useQuasar } from 'quasar'

  const mailStore = useMailStore()
  const { isLoading } = storeToRefs(mailStore)
  const dialogOpen = ref(false)
  const selectedMail = ref(null)
  const $q = useQuasar()

  const columns = [
    { name: 'toEmail', label: 'Кому', align: 'left', field: 'toEmail' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date', format: val => formatDate(val) },
    { name: 'body', label: 'Текст письма', align: 'left', field: 'body' },
  ]

  const searchText = computed({
    get: () => mailStore.filters.searchQuery,
    set: value => mailStore.updateFilters({ searchQuery: value }),
  })

  const filteredMails = computed(() => mailStore.filteredMailsByType('sent'))

  onMounted(async () => {
    try {
      await mailStore.fetchMails('sent')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить письма',
        caption: error.message,
        timeout: 3000,
      })
    }
  })

  function openMail(evt, row) {
    selectedMail.value = row
    dialogOpen.value = true
  }

  async function handleDelete(id) {
    try {
      await mailStore.deleteMail(id, 'sent')
      dialogOpen.value = false
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письмо удалено',
        timeout: 2000,
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось удалить письмо',
        caption: error.message,
        timeout: 3000,
      })
    }
  }
</script>

<style>
  .q-table tbody tr {
    cursor: pointer;
  }
  .q-table tbody tr:hover {
    background-color: #f5f5f5;
  }
</style>
