<template>
  <v-app>

    <v-navigation-drawer permanent v-model="isDrawerOpen" color="#212c3a">
      <v-list>
        <v-list-subheader></v-list-subheader>
        <v-list-item prepend-icon="mdi-fish">Reportar Produção</v-list-item>
        <v-list-item prepend-icon="mdi-download">Extração de Dados</v-list-item>
        <v-list-item prepend-icon="mdi-account-group">Gerenciar Usuários</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat color="#3c8bbc" class="border-b">
      <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      <v-img
      :src="logo"
      max-height="150"
      max-width="150"
      contain
      >
      </v-img>
    </v-app-bar>
    <v-main>
      <h1>Hello</h1>
    </v-main>
  
  </v-app>
</template>

<script setup>
import logo from '@/assets/logo.png'
import { ref } from 'vue';

const isDrawerOpen = ref(false)
</script>

<style>

</style>
