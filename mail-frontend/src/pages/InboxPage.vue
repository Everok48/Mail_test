<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn
        icon="refresh"
        label="Получить новые письма"
        color="primary"
        @click="loadMails"
        class="q-mb-md"
      />
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

      <q-banner v-if="error" class="bg-negative text-white">
        {{ error }}
        <template v-slot:action>
          <q-btn flat color="white" label="Повторить" @click="loadMails" />
        </template>
      </q-banner>
    </div>

    <mail-dialog
      v-if="currentMail"
      v-model="showMailDialog"
      :mail="currentMail"
      @delete="handleDelete"
      @close="closeMailDialog"
    />
  </q-page>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'
  import { formatDate } from 'src/composables/useDateFormat'
  import MailDialog from 'src/components/MailDialog.vue'
  import MailTable from 'src/components/MailTable.vue'
  import { useQuasar } from 'quasar'

  const mailStore = useMailStore()
  const { isLoading, error } = storeToRefs(mailStore)
  const showMailDialog = ref(false)
  const currentMail = ref(null)
  const $q = useQuasar()

  const columns = [
    { name: 'fromEmail', label: 'Отправитель', align: 'left', field: 'fromEmail' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date', format: val => formatDate(val) },
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

<style>
  .q-table tbody tr {
    cursor: pointer;
  }
  .q-table tbody tr:hover {
    background-color: #f5f5f5;
  }
</style>
