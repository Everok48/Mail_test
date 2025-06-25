<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white q-pa-sm shadow-2">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Меню" class="q-mr-md" />
        <q-toolbar-title class="text-h5 text-weight-bold">
          <q-icon name="mail" class="q-mr-sm" /> Почта
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list padding class="q-pt-md">
        <q-item-label header class="text-grey-7 q-mb-sm">Навигация</q-item-label>
        <q-separator spaced />
        <q-item v-for="link in links" :key="link.to" :to="link.to" clickable v-ripple active-class="bg-blue-2 text-primary" class="q-mb-xs q-pa-sm rounded-borders nav-link">
          <q-item-section avatar>
            <q-icon :name="link.icon" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ link.label }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="link.count !== undefined && link.count > 0">
            <q-badge color="primary" rounded>{{ link.count }}</q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption text-center">Medsoft Test &copy; 2025</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMailStore } from 'src/stores/mail-store'

const leftDrawerOpen = ref(false)
const mailStore = useMailStore()

const links = computed(() => [
  {
    label: 'Входящие',
    icon: 'inbox',
    to: '/',
    count: mailStore.inboxCount,
  },
  {
    label: 'Черновики',
    icon: 'edit_note',
    to: '/drafts',
    count: mailStore.draftsCount,
  },
  {
    label: 'Отправленные',
    icon: 'send',
    to: '/sent',
    count: mailStore.sentCount,
  },
  {
    label: 'Создать письмо',
    icon: 'add_circle',
    to: '/create',
  },
])
</script>

<style scoped>
.nav-link {
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover {
  background: #e3f2fd;
  color: #1976d2;
}
.q-drawer {
  min-width: 220px;
}
</style>



<style scoped>
  .nav-link {
    border-radius: 8px;
    transition:
      background 0.2s,
      color 0.2s;
  }
  .nav-link:hover {
    background: #e3f2fd;
    color: #1976d2;
  }
  .q-drawer {
    min-width: 220px;
  }
</style>
