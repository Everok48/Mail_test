<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h5">Входящие</h1>
      <div class="row q-gutter-sm">
        <q-btn icon="refresh" label="Обновить" color="secondary" outline @click="loadMails" />
        <q-btn icon="add" label="Новое письмо" color="primary" to="/create" />
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section class="row items-center q-pb-none">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="searchText"
          placeholder="Поиск..."
          class="col"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-table
        :rows="filteredMails"
        :columns="columns"
        row-key="id"
        flat
        class="q-mt-md"
        :rows-per-page-options="[10, 20, 50]"
        @row-click="openMail"
      >
        <template v-slot:body-cell-subject="props">
          <q-td :props="props" class="cursor-pointer">
            <span class="text-weight-bold">{{ props.row.subject }}</span>
            <div class="text-grey-7 ellipsis">{{ props.row.body }}</div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
            <q-icon size="2em" name="inbox" />
            <span>Писем пока нет</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogOpen">
      <MailDialog v-if="selectedMail" :mail="selectedMail" @delete="handleDelete" />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref } from 'vue'
  import { api } from 'src/boot/axios'
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

  async function handleDelete(id) {
    try {
      await api.delete(`/mails/${id}`)
      dialogOpen.value = false
      loadMails()
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Письмо удалено',
        icon: 'delete',
        timeout: 2000,
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Не удалось удалить письмо',
        caption: error.response?.data?.message || error.message,
        icon: 'warning',
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
