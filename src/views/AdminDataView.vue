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
              <v-btn class="text-none border" @click="router.push(`/`)" rounded="lg" elevation="2"
                :style="{ backgroundColor: '#0CCF13', color: 'black' }">
                Ir para Login
              </v-btn>
            </v-card-actions>
          </v-card>

          <template v-else>
            <v-btn class="text-none border mb-6 mt-2" @click="generateCSV" prepend-icon="mdi-download" rounded="lg"
              elevation="2" :style="{ backgroundColor: '#3c8bbc', color: 'black' }">
              Baixar Dados de Produção
            </v-btn>

            <div v-if="producoesData.length">
              <div v-for="(producaoPorUsuario, index) in producoesData" :key="producaoPorUsuario.userId">
                <v-card-title class="mb-3 text-h5" style="text-align: center;">Mapas de Produção de {{
                  getUserData(producaoPorUsuario.userId)?.nome }}</v-card-title>

                <v-card-subtitle class="mb-6 text-h7" style="text-align: center;">(id: {{ producaoPorUsuario.userId
                }}) / CNPJ: {{ getUserData(producaoPorUsuario.userId)?.cnpj }} </v-card-subtitle>
                <div v-if="producaoPorUsuario.producoes.length">
                  <div v-for="(producao, index) in producaoPorUsuario.producoes" :key="producao.id">
                    <div v-if="producao.producaoEmbarcacaoEspecies.length" class="borda-producao">
                      <v-card-title class="mb-6 text-h6">Mapa de Produção {{ producao.id }}</v-card-title>
                      <v-card-text>
                        <p>Data Inicial do Lote: {{ new Date(producao.dataInicial +
                          'T00:00:00').toLocaleDateString('pt-BR') }}</p>
                        <p>Data Final do Lote: {{ new Date(producao.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR')
                        }}
                        </p>
                        <p>Data de Reporte: {{ new Date(producao.createdAt).toLocaleDateString('pt-BR') }}
                        </p>
                      </v-card-text>
                      <v-data-table class="d-flex align-center mt-10 mb-4"
                        :header-props="{ style: { fontWeight: 'bold', backgroundColor: '#f4f4f4' } }" :headers="headers"
                        :hide-default-footer="true" dense hover :items-per-page="-1" elevation="2" :items="producao.producaoEmbarcacaoEspecies.map((item) => ({
                          especie: item.especie?.nomeComum,
                          embarcacao: item.embarcacao?.rgp.toString()?.toUpperCase(),
                          peso: `${item.peso} kg`,
                        }))" item-value="id">
                      </v-data-table>
                    </div>
                  </div>
                </div>
                <div v-else class="mb-8">
                  <p>Usuário ID {{ producaoPorUsuario.userId }} não possui produções.</p>
                </div>
              </div>
            </div>
            <div v-else>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container v-if="loading">
      <v-card outlined>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
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

const getUserData = (userId) => {
  return usersData.value.find(user => user.id === userId) || {};
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
    window.location.href = '/';
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


const generateCSV = () => {
  const header = '"user", "cnpj", "id_producao", "data_inicial_lote", "data_final_lote", "data_reporte", "nome_comum", "especie", "rgp", "peso"\n';

  const rows = producoesData.value.flatMap((producaoPorUsuario) => {
    const userData = getUserData(producaoPorUsuario.userId);
    return producaoPorUsuario.producoes.flatMap((producao) => {
      return producao.producaoEmbarcacaoEspecies.map((item) => {
        return [
          producaoPorUsuario.userId,
          userData.cnpj,
          producao.id,
          new Date(producao.dataInicial + 'T00:00:00').toLocaleDateString('pt-BR'),
          new Date(producao.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR'),
          new Date(producao.createdAt).toLocaleDateString('pt-BR'),
          item.especie?.nomeComum,
          item.especie?.nomeCientifico,
          item.embarcacao?.rgp.toString()?.toUpperCase(),
          `${item.peso}`,
        ].map((field) => `"${field}"`).join(',');
      });
    });
  }).join('\n');

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'dados_producao_admin.csv';
  link.click();
};
</script>

<style scoped>
.borda-producao {
  border: 2px solid rgba(149, 200, 216, 0.5);
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.borda-producao:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}
</style>
