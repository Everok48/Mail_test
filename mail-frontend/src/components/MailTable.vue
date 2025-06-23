<template>
  <q-card flat bordered>
    <q-card-section class="row items-center q-pb-none">
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
      class="q-mt-md"
      :loading="loading"
      :rows-per-page-options="[10, 20, 50]"
      @row-click="onRowClick"
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
          <q-icon size="2em" :name="noDataIcon" />
          <span>{{ noDataText }}</span>
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
</script>
