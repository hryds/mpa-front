<template>
  <v-app>
    <v-container v-if="isAdmin">
      <v-card outlined>
        <v-card-title class="text-h5 d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-tooltip text="Voltar">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="24" @click="router.back()">mdi-arrow-left</v-icon>
              </template>
            </v-tooltip>
            <span class="mx-2">Extração de Dados</span>
          </div>

          <v-tooltip text="Sair" v-if="hasAccess && !loading">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="28" @click="logoutUser">mdi-logout</v-icon>
            </template>
          </v-tooltip>
        </v-card-title>

        <v-card-text>
          <v-card v-if="!hasAccess" variant="flat">
            <v-card-title class="text-h5">Acesso Restrito</v-card-title>
            <v-card-text>
              <p>É necessário fazer login para acessar esta página.</p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="text-none border" @click="router.push(`/`)" rounded="xs" elevation="2"
                :style="{ backgroundColor: '#ddf0c7', color: 'black' }">
                Ir para Login
              </v-btn>
            </v-card-actions>
          </v-card>

          <template v-else>
            <v-btn class="text-none border mb-6" prepend-icon="mdi-download" rounded="xs" elevation="2"
              :style="{ backgroundColor: '#f4f4f4', color: 'black' }">
              Baixar Dados de Produção
            </v-btn>

            <div v-if="producoesData.length">
              <div v-for="(producaoPorUsuario, index) in producoesData" :key="producaoPorUsuario.userId"
                class="borda-producao">
                <h2 class="mb-6" style="text-align: center;">Mapas de Produção de Usuário {{ producaoPorUsuario.userId
                  }}</h2>
                <div v-if="producaoPorUsuario.producoes.length">
                  <div v-for="(producao, index) in producaoPorUsuario.producoes" :key="producao.id"
                    class="borda-producao">
                    <h3 class="mb-2" style="text-align: center;">Mapa de Produção {{ producao.id }}</h3>
                    <h4>Data Inicial do Lote: {{ new Date(producao.dataInicial +
                      'T00:00:00').toLocaleDateString('pt-BR') }}</h4>
                    <h4>Data Final do Lote: {{ new Date(producao.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR') }}
                    </h4>
                    <h4>Data de Reporte: {{ new Date(producao.createdAt).toLocaleDateString('pt-BR') }}
                    </h4>
                    <v-data-table class="d-flex align-center" :headers="headers" :hide-default-footer="true"
                      :items-per-page="-1" :items="producao.producaoEmbarcacaoEspecies.map((item) => ({
                        especie: item.especie?.nomeComum,
                        embarcacao: item.embarcacao?.rgp,
                        peso: `${item.peso} kg`,
                      }))" item-value="id">
                    </v-data-table>
                  </div>
                </div>
                <div v-else>
                  <p>Usuário ID {{ producaoPorUsuario.userId }} não possui produções.</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Carregando dados de produção...</p>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container v-if="loading">
      <v-card outlined>
        <v-card-title class="text-h5">Carregando...</v-card-title>
      </v-card>
    </v-container>


    <v-container v-else-if="!loading && !isAdmin">
      <v-card outlined>
        <v-card-title class="text-h5">404 - Página Não Encontrada</v-card-title>
      </v-card>
    </v-container>

  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import APICalls from "@/services/APICalls";

const router = useRouter();
const usersData = ref([]);
const userIds = ref([]);
const producoesData = ref([]);
const hasAccess = ref(true);
const userInfo = ref('');
const isAdmin = ref(false);
const currentUserID = ref(0);
const loading = ref(true);

const headers = ref([
  { title: "Espécie", value: "especie" },
  { title: "Embarcação (RGP)", value: "embarcacao" },
  { title: "Peso (kg)", value: "peso" },
]);

const loadUsers = async () => {
  try {
    const response = await APICalls.getUsers();
    usersData.value = response.data.users;
    userIds.value = usersData.value.map((user) => user.id);
    console.log("User IDs:", userIds.value);
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      hasAccess.value = false;
    }
  }
};

const loadConsultas = async () => {
  try {
    const promises = userIds.value.map(async (userId) => {
      const response = await APICalls.getConsultas(userId);
      return {
        userId,
        producoes: response.data.producoes,
      };
    });
    producoesData.value = await Promise.all(promises);
    console.log("Dados das Produções:", producoesData.value);
  } catch (error) {
    console.error("Erro ao carregar dados de produção:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      hasAccess.value = false;
    }
  }
};

const loadUserInfo = async () => {
  try {
    const response = await APICalls.getUser(currentUserID.value);
    if (response.status === 200) {
      userInfo.value = response.data.user;
      isAdmin.value = userInfo.value.tipo === "admin";
      console.log("Tipo de usuário:", userInfo.value.tipo);
    }
  } catch (error) {
    console.error("Erro ao carregar informações do usuário:", error);
  }
};

const getUserID = async () => {
  try {
    const response = await APICalls.verifyID();
    if (response.status === 200) {
      currentUserID.value = response.data.usersessionid;
      console.log(currentUserID.value)
    }
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log(err)
    } else {
      console.error("Erro inesperado:", error);
    }
  }
};

const logoutUser = async () => {
  try {
    const response = await APICalls.logOut();
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.clear();
    router.push(`/`)
  } catch (error) {
    console.error('Erro durante o logout:', error.response?.data || error.message);
  }
};

onMounted(async () => {
  await getUserID();
  await loadUserInfo();

  if (isAdmin.value) {
    await loadUsers();
    if (hasAccess.value) {
      await loadConsultas();
    }
  }

  loading.value = false;
});
</script>

<style scoped>
.borda-producao {
  border: 2px solid #999999;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
}
</style>
