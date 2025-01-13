<template>
  <div class="app">
    <v-app>

      <v-navigation-drawer class="border" permanent v-model="isDrawerOpen" color="#212c3a">
        <v-list>
          <v-list-subheader></v-list-subheader>
          <v-list-item prepend-icon="mdi-fish" @click="handleNavigation('reportar-producao')">Reportar
            Produção</v-list-item>
          <v-list-item prepend-icon="mdi-download" @click="handleNavigation('extracao-dados')">Extração de
            Dados</v-list-item>
          <v-list-item prepend-icon="mdi-account-group" @click="handleNavigation('gerenciar-usuarios')">Gerenciar
            Usuários</v-list-item>
        </v-list>
        <v-container color="#212c3a">
          <v-btn v-if="isAuthenticated" prepend-icon="mdi-logout" rounded="xs" elevation="2">Sair</v-btn>
        </v-container>
      </v-navigation-drawer>

      <v-app-bar flat color="#3c8bbc" class="border-b">
        <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
        <v-img :src="logo" max-height="150" max-width="150" contain>
        </v-img>
      </v-app-bar>
      <v-main>
        <DataView/>
       <!--  <LoginView /> -->
        <!-- <RegistrationView/>-->
      </v-main>

    </v-app>
  </div>
</template>

<script setup>
import logo from '@/assets/logo.png'
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import RegistrationView from './views/RegistrationView.vue';
import LoginView from './views/LoginView.vue';
import DataView from './views/DataView.vue';

const isDrawerOpen = ref(false)


const handleNavigation = (route) => {
  console.log(`Navegando para: ${route}`);
  // Substitua o console.log por lógica de navegação
};

const isAuthenticated = ref(true);
</script>

<style>
.v-application {
  background: url('./assets/atum.png') no-repeat center;
  background-size: cover;
}

.v-navigation-drawer .v-list-item {
  border-color: black;
  margin-bottom: 10px;

}
</style>
