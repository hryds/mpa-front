<template>
  <div class="app">
    <v-app>

      <v-navigation-drawer class="border" permanent v-model="isDrawerOpen" color="#212c3a">
        <v-list>
          <v-list-subheader></v-list-subheader>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-fish"
            @click="router.push(`/reportar-producao`)">Reportar
            Produção </v-list-item>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-download"
            @click="router.push(`/extracao-dados`)">Extração de
            Dados</v-list-item>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-account-group"
            @click="router.push(`/gerenciar-usuarios`)">Gerenciar
            Usuários</v-list-item>
        </v-list>
        <v-container color="#212c3a">
          <v-btn @click="router.push(`/`)" class="text-none border-md elevated" v-if="isAuthenticated" prepend-icon="mdi-logout" rounded="xs"
            elevation="3" :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Sair</v-btn>
        </v-container>
      </v-navigation-drawer>

      <v-app-bar flat color="#3c8bbc" class="border-b">
        <v-tooltip text="Menu">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon  v-bind="props" @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
          </template>
        </v-tooltip>
        <v-img :src="logo" max-height="150" max-width="150" contain>
        </v-img>
      </v-app-bar>
      <v-main>
        <!--<ReportView/>-->
        <!-- <DataView/>-->
        <!-- <LoginView /> -->
        <!-- <RegistrationView/>-->
        <RouterView />
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
import ReportView from './views/ReportView.vue';
import { RouterView, RouterLink } from 'vue-router';
import { useRoute, useRouter } from "vue-router"
const isDrawerOpen = ref(false)
const route = useRoute()
const router = useRouter()


const isAuthenticated = ref(true);


</script>

<style>
.v-application {
  background: url('./assets/atum.png') no-repeat center;
  background-size: cover;
  background-attachment: fixed;
}

.v-navigation-drawer .v-list-item {
  border-color: black;
  margin-bottom: 10px;

}
</style>
