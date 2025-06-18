<template>
  <q-layout>
    <q-header class="header-box">
      <q-toolbar>
        <q-btn icon="menu" @click="toggleDrawer" />
        <q-toolbar-title class="header-title">
          Почта
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" class="menu-box">
      <q-list>
        <q-item to="/" clickable>
          <q-item-section>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section>
            Входящие
          </q-item-section>
        </q-item>

        <q-item to="/drafts" clickable>
          <q-item-section>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section>
            Черновики
          </q-item-section>
        </q-item>

        <q-item to="/sent" clickable>
          <q-item-section>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section>
            Отправленные
          </q-item-section>
        </q-item>

        <q-item to="/compose" clickable>
          <q-item-section>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            Создать письмо
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawerOpen = ref(false)
function toggleDrawer () {
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
</style>
