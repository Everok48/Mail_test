<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="q-pb-none">
      <div class="text-h6 ellipsis">{{ mail.subject || '(Без темы)' }}</div>
      <div class="text-subtitle2 text-grey-7">
        {{ formatDate(mail.date, 'DD MMMM YYYY в HH:mm') }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-list dense>
        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>От кого</q-item-label>
            <q-item-label>{{ mail.fromEmail || '(не указано)' }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="alternate_email" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Кому</q-item-label>
            <q-item-label>{{ mail.toEmail || '(не указано)' }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh" class="scroll">
      <q-input
        outlined
        v-model="mail.body"
        type="textarea"
        label="Текст письма"
        rows="10"
        :rules="[val => !!val || 'Текст письма не может быть пустым']"
        lazy-rules
      />
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="bg-grey-1">
      <q-btn flat label="Удалить" color="negative" @click="onDelete" />
      <q-btn flat label="Назад" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { formatDate } from 'src/helpers/useDateFormat'

  const props = defineProps({
    mail: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['delete'])

  const onDelete = () => {
    emit('delete', props.mail.id)
  }
</script>

<style scoped>
  .mail-dialog-card {
    min-width: 350px;
    max-width: 500px;
  }
  .mail-dialog-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .mail-dialog-info {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .mail-dialog-body {
    margin-top: 10px;
    font-size: 16px;
  }
</style>
