<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h5">Черновики</h1>
      <q-btn icon="add" label="Новый черновик" color="primary" to="/create" />
    </div>

    <MailTable
      v-model="searchText"
      :rows="filteredMails"
      :columns="columns"
      :loading="isLoading"
      :noDataIcon="'drafts'"
      :noDataText="'Черновиков пока нет'"
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
  ]

  const searchText = computed({
    get: () => mailStore.filters.searchQuery,
    set: value => mailStore.updateFilters({ searchQuery: value }),
  })

  const filteredMails = computed(() => mailStore.filteredMailsByType('drafts'))

  onMounted(async () => {
    try {
      await mailStore.fetchMails('drafts')
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить черновики',
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
      await mailStore.deleteMail(id, 'drafts')
      dialogOpen.value = false
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Черновик удален',
        timeout: 2000,
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось удалить черновик',
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
