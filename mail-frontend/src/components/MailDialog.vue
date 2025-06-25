<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="q-pb-none">
      <div v-if="isDraft">
        <q-form ref="editForm" @submit.prevent="onSave">
          <q-input
            v-model="editMail.fromEmail"
            label="От кого"
            outlined
            dense
            :rules="[
              val => !!val || 'Поле не может быть пустым',
              val => /.+@.+\..+/.test(val) || 'Введите корректный email',
            ]"
            lazy-rules
            class="q-mb-sm"
          />
          <q-input
            v-model="editMail.toEmail"
            label="Кому"
            outlined
            dense
            :rules="[
              val => !!val || 'Поле не может быть пустым',
              val => /.+@.+\..+/.test(val) || 'Введите корректный email',
            ]"
            lazy-rules
            class="q-mb-sm"
          />
          <q-input
            v-model="editMail.subject"
            label="Тема"
            outlined
            dense
            :rules="[val => !!val || 'Тема не может быть пустой']"
            lazy-rules
            class="q-mb-sm"
          />
        </q-form>
      </div>
      <div v-else class="text-h6 ellipsis">{{ mail.subject || '(Без темы)' }}</div>
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
            <q-item-label v-if="!isDraft">{{ mail.fromEmail || '(не указано)' }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="alternate_email" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Кому</q-item-label>
            <q-item-label v-if="!isDraft">{{ mail.toEmail || '(не указано)' }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh" class="scroll">
      <q-form v-if="isDraft" ref="editFormBody" @submit.prevent="onSave">
        <q-input
          outlined
          v-model="editMail.body"
          type="textarea"
          label="Текст письма"
          rows="10"
          :rules="[val => !!val || 'Текст письма не может быть пустым']"
          lazy-rules
        />
      </q-form>
      <p v-else style="white-space: pre-wrap">{{ mail.body }}</p>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="bg-grey-1">
      <q-btn flat label="Удалить" color="negative" @click="onDelete" />
      <q-btn flat label="Назад" color="primary" v-close-popup />
      <q-btn v-if="isDraft" flat label="Сохранить" color="primary" @click="validateAndSave" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { formatDate } from 'src/helpers/useDateFormat'

  const props = defineProps({
    mail: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      default: '', // 'draft', 'inbox', 'sent'
    },
  })

  const emit = defineEmits(['delete', 'save'])

  const isDraft = computed(() => props.mode === 'draft' || props.mail.type === 'draft')

  const editMail = ref({ ...props.mail })
  watch(
    () => props.mail,
    val => {
      editMail.value = { ...val }
    }
  )

  const editForm = ref(null)
  const editFormBody = ref(null)

  const onDelete = () => {
    emit('delete', props.mail.id)
  }

  const onSave = () => {
    emit('save', { ...editMail.value })
  }

  const validateAndSave = async () => {
    // Проверяем обе формы (основные поля и body)
    const validMain = (await editForm.value?.validate?.()) ?? true
    const validBody = (await editFormBody.value?.validate?.()) ?? true
    if (validMain && validBody) {
      onSave()
    }
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
