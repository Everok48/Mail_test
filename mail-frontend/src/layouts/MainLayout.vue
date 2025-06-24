<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Почта
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>Навигация</q-item-label>

        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Входящие</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="inboxCount > 0" color="primary" :label="inboxCount" />
          </q-item-section>
        </q-item>

        <q-item to="/drafts" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Черновики</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="draftsCount > 0" color="orange" :label="draftsCount" />
          </q-item-section>
        </q-item>

        <q-item to="/sent" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Отправленные</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="sentCount > 0" color="green" :label="sentCount" />
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item to="/create" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Создать письмо</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
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
  import { ref } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'

  const leftDrawerOpen = ref(false)
  const mailStore = useMailStore()
  const { inboxCount, draftsCount, sentCount } = storeToRefs(mailStore)

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
</script>

<style lang="scss">
  .q-item.q-router-link--active {
    color: $primary;
  }
</style>
