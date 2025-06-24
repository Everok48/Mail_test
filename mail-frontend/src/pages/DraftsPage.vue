<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Черновики</h1>
      <div class="row q-gutter-sm">
        <q-btn
          icon="refresh"
          round
          dense
          flat
          color="primary"
          @click="loadMails"
          title="Обновить"
        />
        <q-btn icon="add" label="Новое письмо" color="primary" to="/create" />
      </div>
    </div>

    <MailTable
      v-model="searchQuery"
      :rows="filteredMails"
      :columns="columns"
      :loading="isLoading"
      :noDataIcon="'drafts'"
      :noDataText="'Черновиков пока нет'"
      :onRowClick="openMail"
    >
      <template #body-cell-subject="props">
        <q-td :props="props" class="cursor-pointer">
          <span class="text-weight-bold">{{ props.row.subject || '(Без темы)' }}</span>
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
  import { onMounted, computed, ref } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'
  import MailDialog from 'components/MailDialog.vue'
  import MailTable from 'components/MailTable.vue'
  import { useQuasar } from 'quasar'
  import { formatDate } from 'src/helpers/useDateFormat'

  const mailStore = useMailStore()
  const { isLoading, error } = storeToRefs(mailStore)
  const $q = useQuasar()

  const showMailDialog = ref(false)
  const currentMail = ref(null)

  const filteredMails = computed(() => mailStore.filteredMailsByType('drafts'))
  const searchQuery = computed({
    get: () => mailStore.filters.searchQuery,
    set: val => mailStore.updateFilters({ searchQuery: val }),
  })

  const columns = [
    {
      name: 'toEmail',
      label: 'Кому',
      align: 'left',
      field: 'toEmail',
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

  const loadMails = async () => {
    try {
      await mailStore.fetchMails('drafts')
    } catch (err) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось загрузить черновики',
        caption: err.message,
      })
    }
  }

  onMounted(() => {
    // Загружаем письма, только если их еще нет в сторе
    if (mailStore.drafts.length === 0) {
      loadMails()
    }
  })

  function openMail(evt, mail) {
    currentMail.value = mail
    showMailDialog.value = true
  }

  const closeMailDialog = () => {
    showMailDialog.value = false
    currentMail.value = null
  }

  async function handleDelete(id) {
    try {
      await mailStore.deleteMail(id, 'drafts')
      closeMailDialog()
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Черновик удален',
        timeout: 2000,
      })
    } catch (e) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Ошибка удаления черновика',
        caption: e.message,
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
