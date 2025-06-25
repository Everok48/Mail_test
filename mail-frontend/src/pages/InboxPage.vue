<template>
  <q-page padding class="q-mx-auto" style="max-width: 1100px;">
    <div class="row items-center justify-between q-mb-lg q-gutter-md">
      <div class="row items-center q-gutter-md">
        <q-icon name="inbox" size="32px" color="primary" />
        <h1 class="text-h4 text-weight-bold q-mb-none">Входящие</h1>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          icon="refresh"
          label="Получить новые письма"
          color="primary"
          outline
          rounded
          @click="loadMails"
        />
        <q-btn icon="add" label="Новое письмо" color="primary" rounded to="/create" />
      </div>
    </div>
    <q-separator spaced />
    <MailTable
      v-model="searchQuery"
      :rows="filteredMails"
      :columns="columns"
      :loading="isLoading"
      :noDataIcon="'inbox'"
      :noDataText="'Входящих писем пока нет'"
      :onRowClick="openMail"
    >
      <template #body-cell-subject="props">
        <q-td :props="props" class="cursor-pointer">
          <span class="text-weight-bold">{{ props.row.subject }}</span>
          <div class="text-grey-7 ellipsis">{{ props.row.body }}</div>
        </q-td>
      </template>
    </MailTable>
    <div v-if="isLoading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
    </div>
    <q-banner v-if="error" class="bg-negative text-white q-mt-md">
      {{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Повторить" @click="loadMails" />
      </template>
    </q-banner>
    <q-dialog v-model="showMailDialog">
      <mail-dialog
        v-if="currentMail"
        :mail="currentMail"
        @delete="handleDelete"
        @close="closeMailDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'
  import { formatDate } from 'src/helpers/useDateFormat'
  import MailDialog from 'src/components/MailDialog.vue'
  import MailTable from 'src/components/MailTable.vue'
  import { useQuasar } from 'quasar'

  const mailStore = useMailStore()
  const { isLoading, error } = storeToRefs(mailStore)
  const showMailDialog = ref(false)
  const currentMail = ref(null)
  const $q = useQuasar()

  const columns = [
    {
      name: 'fromEmail',
      label: 'Отправитель',
      align: 'left',
      field: 'fromEmail',
      style: 'width: 250px',
    },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    {
      name: 'date',
      label: 'Дата',
      align: 'right',
      field: 'date',
      format: val => formatDate(val),
      style: 'width: 150px',
    },
  ]

  const searchQuery = computed({
    get: () => mailStore.filters.searchQuery,
    set: value => mailStore.updateFilters({ searchQuery: value }),
  })

  const filteredMails = computed(() => mailStore.filteredMailsByType('inbox'))

  const loadMails = async () => {
    try {
      await mailStore.fetchMails('inbox')
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письма успешно загружены',
        timeout: 2000,
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить письма',
        caption: error.message,
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

  async function handleDelete(id) {
    try {
      await mailStore.deleteMail(id, 'inbox')
      showMailDialog.value = false
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

  onMounted(loadMails)
</script>

<style scoped>
h1 {
  letter-spacing: -1px;
}

.q-table tbody tr {
  cursor: pointer;
}
.q-table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
