<template>
  <q-card flat bordered class="q-mb-md shadow-2">
    <q-card-section class="row items-center q-pb-none q-gutter-md">
      <q-input
        outlined
        dense
        debounce="300"
        v-model="searchTextProxy"
        placeholder="Поиск..."
        class="col"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      class="q-mt-md modern-mail-table"
      :loading="loading"
      :rows-per-page-options="[10, 20, 50]"
      @row-click="handleRowClick"
      header-class="bg-primary text-white text-weight-bold"
      table-class="modern-table-body"
      table-header-class="modern-table-header"
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm q-py-xl">
          <q-icon size="4em" :name="noDataIcon" />
          <div class="text-center">
            <div class="text-h6">{{ noDataText }}</div>
            <div class="text-caption text-grey-7">
              Попробуйте изменить фильтры или создать новое письмо.
            </div>
          </div>
        </div>
      </template>
      <slot name="body-cell-subject" />
    </q-table>
  </q-card>
</template>

<script setup>
  import { computed } from 'vue'
  const props = defineProps({
    rows: Array,
    columns: Array,
    loading: Boolean,
    modelValue: String,
    noDataIcon: { type: String, default: 'drafts' },
    noDataText: { type: String, default: 'Нет данных' },
    onRowClick: Function,
  })
  const emit = defineEmits(['update:modelValue'])
  const searchTextProxy = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const handleRowClick = (evt, row, index) => {
    if (props.onRowClick) {
      props.onRowClick(evt, row, index)
    }
  }
</script>

<style scoped>
  .modern-mail-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
  .modern-table-body tbody tr {
    border-bottom: 1px solid #e0e0e0;
    height: 56px;
    transition: background 0.2s;
    cursor: pointer;
  }
  .modern-table-body tbody tr:hover {
    background: #f0f4ff;
  }
  .modern-table-header th {
    background: #1976d2 !important;
    color: #fff !important;
    font-weight: 600;
    font-size: 1.05em;
  }
  @media (max-width: 700px) {
    .modern-mail-table {
      box-shadow: none;
      border-radius: 0;
    }
    .modern-table-body tbody tr {
      display: block;
      margin-bottom: 12px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
      background: #fff;
      border: 1px solid #e0e0e0;
      height: auto;
    }
    .modern-table-body tbody td {
      display: block;
      padding: 8px 12px;
      border: none;
    }
  }
</style>
