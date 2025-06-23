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
          <q-item-section> Входящие </q-item-section>
        </q-item>

        <q-item to="/drafts" clickable>
          <q-item-section>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section> Черновики </q-item-section>
        </q-item>

        <q-item to="/sent" clickable>
          <q-item-section>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section> Отправленные </q-item-section>
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

  const drawerOpen = ref(false)
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }
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
  }
  .footer-content {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: right;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 15px;
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
