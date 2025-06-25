<template>
  <q-page padding class="q-mx-auto" style="max-width: 1100px;">
    <div class="row items-center justify-between q-mb-lg q-gutter-md">
      <div class="row items-center q-gutter-md">
        <q-icon name="send" size="32px" color="primary" />
        <h1 class="text-h4 text-weight-bold q-mb-none">Отправленные</h1>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          icon="refresh"
          label="Обновить"
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
    <q-banner v-if="error" class="bg-negative text-white q-mt-md">
      {{ error }}
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
  import MailDialog from 'components/MailDialog.vue'
  import { formatDate } from 'src/helpers/useDateFormat'
  import MailTable from 'components/MailTable.vue'
  import { useQuasar } from 'quasar'

  const mailStore = useMailStore()
  const { isLoading, error } = storeToRefs(mailStore)
  const showMailDialog = ref(false)
  const currentMail = ref(null)
  const $q = useQuasar()

  const columns = [
    { name: 'toEmail', label: 'Кому', align: 'left', field: 'toEmail' },
    { name: 'subject', label: 'Тема', align: 'left', field: 'subject' },
    { name: 'date', label: 'Дата', align: 'left', field: 'date', format: val => formatDate(val) },
  ]

  const searchQuery = computed({
    get: () => mailStore.filters.searchQuery,
    set: value => mailStore.updateFilters({ searchQuery: value }),
  })

  const filteredMails = computed(() => mailStore.filteredMailsByType('sent'))

  const loadMails = async () => {
    try {
      await mailStore.fetchMails('sent')
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Не удалось загрузить отправленные',
        caption: err.message,
      })
    }
  }

  onMounted(() => {
    if (filteredMails.value.length === 0) {
      loadMails()
    }
  })

  function openMail(evt, row) {
    currentMail.value = row
    showMailDialog.value = true
  }

  const closeMailDialog = () => {
    showMailDialog.value = false
    currentMail.value = null
  }

  async function handleDelete(id) {
    try {
      await mailStore.deleteMail(id, 'sent')
      closeMailDialog()
      $q.notify({
        type: 'positive',
        message: 'Письмо удалено',
      })
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Ошибка удаления',
        caption: err.message,
      })
    }
  }
</script>

<style scoped>
h1 {
  letter-spacing: -1px;
}
</style>
