<template>
  <div class="app">
    <v-app>
      <v-app-bar flat color="#3c8bbc" class="border-b">
        <v-tooltip text="Menu">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon v-bind="props" @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
          </template>
        </v-tooltip>
        <v-img :src="logo1" max-height="230" max-width="230" contain>
        </v-img>
      </v-app-bar>

      <v-navigation-drawer class="border" permanent v-model="isDrawerOpen" color="#212c3a">
        <v-list>
          <v-list-subheader></v-list-subheader>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-fish"
            @click="router.push(`/reportar-producao`)">Reportar
            Produção </v-list-item>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-download"
            @click="router.push(`/extracao-dados`)">Extração de
            Dados</v-list-item>
          <v-list-item class="elevation-2 border-double border-md" prepend-icon="mdi-account-edit"
            @click="router.push(`/gerenciar-conta`)">Gerenciamento de Conta</v-list-item>
        </v-list>
        <v-container color="#212c3a">
          <v-btn v-if="isAuthenticated" class="text-none border-md elevated" prepend-icon="mdi-logout" rounded="lg"
            elevation="3" :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="logoutUser">Sair</v-btn>
        </v-container>
      </v-navigation-drawer>

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
import logo1 from '@/assets/logo1.png'
import { ref, watch, watchEffect } from 'vue';
import HomeView from './views/AdminDataView.vue';
import RegistrationView from './views/RegistrationView.vue';
import LoginView from './views/LoginView.vue';
import DataView from './views/DataView.vue';
import ReportView from './views/ReportView.vue';
import APICalls from './services/APICalls';
import { RouterView, RouterLink } from 'vue-router';
import { useRoute, useRouter } from "vue-router"
const isDrawerOpen = ref(true)
const route = useRoute()
const router = useRouter()


const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'false');

watchEffect(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
});
const logoutUser = async () => {
  try {
    const response = await APICalls.logOut();
    localStorage.setItem('isAuthenticated', 'false');
    isAuthenticated.value = false;
    localStorage.clear();
    router.push(`/`)
  } catch (error) {
    console.error('Erro durante o logout:', error.response?.data || error.message);
  }
};

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
