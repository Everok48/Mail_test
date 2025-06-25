<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="q-pa-md">
      <q-input
        outlined
        dense
        debounce="300"
        v-model="searchTextProxy"
        placeholder="Поиск по теме, отправителю или содержанию..."
        class="col"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="searchTextProxy">
          <q-icon name="clear" class="cursor-pointer" @click="searchTextProxy = ''" />
        </template>
      </q-input>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <div v-if="loading" class="q-pa-md">
        <q-list>
          <q-item v-for="n in 5" :key="n" style="height: 90px">
            <q-item-section avatar top>
              <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
              <q-skeleton type="text" width="30%" />
              <q-skeleton type="text" width="50%" />
              <q-skeleton type="text" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div
        v-else-if="!rows || rows.length === 0"
        class="full-width row flex-center text-grey-7 q-gutter-sm q-py-xl"
      >
        <q-icon size="4em" :name="noDataIcon" />
      </div>

      <q-list v-else class="mail-list" separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-item
            v-for="mail in rows"
            :key="mail.id"
            clickable
            v-ripple
            @click="handleRowClick($event, mail)"
            class="q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar color="primary" text-color="white">
                {{ getAvatarText(mail.fromEmail || mail.toEmail) }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="text-weight-bold">
                {{ mail.fromEmail || mail.toEmail }}
              </q-item-label>
              <q-item-label lines="1">
                {{ mail.subject || '(Без темы)' }}
              </q-item-label>
              <q-item-label lines="2" caption class="text-grey-8">
                {{ mail.body }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{ formatDate(mail.date) }}</q-item-label>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
  import { computed } from 'vue'
  import { formatDate } from 'src/helpers/useDateFormat'

  const props = defineProps({
    rows: Array,
    columns: Array,
    loading: Boolean,
    modelValue: String,
    noDataIcon: { type: String, default: 'inbox_archive' },
    noDataText: { type: String, default: 'Нет данных' },
    onRowClick: Function,
  })

  const emit = defineEmits(['update:modelValue'])

  const searchTextProxy = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const handleRowClick = (evt, row) => {
    if (props.onRowClick) {
      props.onRowClick(evt, row)
    }
  }

  const getAvatarText = email => {
    if (!email) return '?'
    return email[0].toUpperCase()
  }
</script>

<style scoped>
  .mail-list .q-item {
    transition: background-color 0.3s;
  }
  .mail-list .q-item:hover {
    background-color: #f5f5f5;
  }
  .q-item__label--caption {
    white-space: pre-wrap;
  }
</style>
