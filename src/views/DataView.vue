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
                        <div v-for="(producao, index) in producoesData" :key="producao.id" class="borda-producao">
                            <h3 class="mb-2" style="text-align: center;">Mapa de Produção {{ producao.id }}</h3>
                            <h4>Data Inicial do Lote: {{ new Date(producao.dataInicial +
                                'T00:00:00').toLocaleDateString('pt-BR') }}
                            </h4>
                            <h4>Data Final do Lote: {{ new Date(producao.dataFinal +
                                'T00:00:00').toLocaleDateString('pt-BR') }}</h4>
                            <div class="mb-5"></div>
                            <v-data-table class="d-flex align-center" :headers="headers" :items-per-page="5" :items="producao.producaoEmbarcacaoEspecies.map(item => ({
                                especie: item.especie?.nomeComum,
                                embarcacao: item.embarcacao?.rgp,
                                peso: item.peso
                            }))" item-value="id"></v-data-table>
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
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import APICalls from '@/services/APICalls';

const router = useRouter();
const sessionUserId = ref(1);
const producoesData = ref([]);

const headers = ref([
    { title: 'Espécie', value: 'especie' },
    { title: 'Embarcação (RGP)', value: 'embarcacao' },
    { title: 'Peso (kg)', value: 'peso' },
]);


const loadConsultas = async () => {
    try {

        const response = await APICalls.getConsultas(sessionUserId.value);


        producoesData.value = response.data.producoes;

        console.log(producoesData.value);
    } catch (error) {
        console.error("Erro ao carregar dados de produção:", error);
    }
};


onMounted(() => {
    loadConsultas();
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