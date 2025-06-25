<template>
  <q-page padding class="q-mx-auto" style="max-width: 1100px">
    <div class="row items-center justify-between q-mb-lg q-gutter-md">
      <div class="row items-center q-gutter-md">
        <q-icon name="send" size="32px" color="primary" />
        <h1 class="text-h4 text-weight-bold q-mb-none">Отправленные</h1>
      </div>
      <div class="row q-gutter-sm">
        <q-btn icon="refresh" label="Обновить" color="primary" outline rounded @click="loadMails">
          <q-tooltip>Обновить отправленные</q-tooltip>
        </q-btn>
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
    />
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
  import MailDialog from 'src/components/MailDialog.vue'
  import MailTable from 'src/components/MailTable.vue'
  import { useMailPage } from 'src/helpers/useMailPage'

  const {
    isLoading,
    error,
    showMailDialog,
    currentMail,
    columns,
    filteredMails,
    searchQuery,
    loadMails,
    openMail,
    closeMailDialog,
    handleDelete,
  } = useMailPage('sent')
</script>

<style scoped>
  h1 {
    letter-spacing: -1px;
  }
</style>
