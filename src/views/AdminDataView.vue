<template>
  <v-app>
    <v-container>
      <v-card outlined>
        <v-card-title class="text-h5">
          <v-tooltip text="Voltar">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="24" @click="router.back()">mdi-arrow-left</v-icon>
            </template>
          </v-tooltip>
          Extração de Dados
        </v-card-title>
        <v-card-actions>
          <v-btn class="text-none border" prepend-icon="mdi-download" rounded="xs" elevation="2"
            :style="{ backgroundColor: '#f4f4f4', color: 'black' }">
            Baixar Dados de Produção
          </v-btn>
        </v-card-actions>

        <v-card-text>
          <div v-if="producoesData.length">
            <div v-for="(producaoPorUsuario, index) in producoesData" :key="producaoPorUsuario.userId"
              class="borda-producao">
              <h2 class="mb-6" style="text-align: center;">Mapas de Produção de Usuário {{ producaoPorUsuario.userId }}
              </h2>
              <div v-if="producaoPorUsuario.producoes.length">
                <div v-for="(producao, index) in producaoPorUsuario.producoes" :key="producao.id"
                  class="borda-producao">
                  <h3 class="mb-2" style="text-align: center;">Mapa de Produção {{ producao.id }}</h3>
                  <h4>
                    Data Inicial do Lote:
                    {{ new Date(producao.dataInicial + 'T00:00:00').toLocaleDateString('pt-BR') }}
                  </h4>
                  <h4>
                    Data Final do Lote:
                    {{ new Date(producao.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR') }}
                  </h4>

                  <v-data-table class="d-flex align-center" :headers="headers" :hide-default-footer="true"
                    :items-per-page="-1" :items="producao.producaoEmbarcacaoEspecies.map((item) => ({
                      especie: item.especie?.nomeComum,
                      embarcacao: item.embarcacao?.rgp,
                      peso: `${item.peso} kg`,
                    }))" item-value="id"></v-data-table>
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
        </v-card-text>
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
  }
};

onMounted(async () => {
  await loadUsers();
  await loadConsultas();
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
