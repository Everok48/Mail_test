<template>
  <q-layout>
    <q-header class="header-box">
      <q-toolbar>
        <q-btn icon="menu" @click="toggleDrawer" />
        <q-toolbar-title class="header-title"> Почта </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" class="menu-box">
      <q-list>
        <q-item to="/" clickable>
          <q-item-section>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section class="row items-center">
            Входящие
            <q-badge v-if="inboxCount > 0" color="primary" class="q-ml-sm">{{
              inboxCount
            }}</q-badge>
          </q-item-section>
        </q-item>

        <q-item to="/drafts" clickable>
          <q-item-section>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section class="row items-center">
            Черновики
            <q-badge v-if="draftsCount > 0" color="primary" class="q-ml-sm">{{
              draftsCount
            }}</q-badge>
          </q-item-section>
        </q-item>

        <q-item to="/sent" clickable>
          <q-item-section>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section class="row items-center">
            Отправленные
            <q-badge v-if="sentCount > 0" color="primary" class="q-ml-sm">{{ sentCount }}</q-badge>
          </q-item-section>
        </q-item>

        <q-item to="/create" clickable>
          <q-item-section>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section> Создать письмо </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="footer-box">
      <div class="footer-content">
        <span>Medsoft Test &copy; 2025</span>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
  import { ref } from 'vue'
  import { useMailStore } from 'src/stores/mail-store'
  import { storeToRefs } from 'pinia'

  const drawerOpen = ref(false)
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  const mailStore = useMailStore()
  const { inboxCount, draftsCount, sentCount } = storeToRefs(mailStore)
</script>

<style scoped>
  .header-box {
    background: #1976d2;
  }
  .header-title {
    color: white;
    font-size: 20px;
    font-weight: bold;
  }
  .menu-box {
    background: #f5f5f5;
  }
  .footer-box {
    background: #1976d2;
    color: white;
    padding: 0;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 -2px 8px rgba(25, 118, 210, 0.08);
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    z-index: 100;
  }
  .footer-content {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    font-size: 15px;
    text-align: center;
  }
  .footer-icon {
    margin-right: 8px;
    font-size: 20px;
  }
  .footer-right {
    font-size: 13px;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 2px;
  }
</style>
