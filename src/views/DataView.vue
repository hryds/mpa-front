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
                        <v-btn v-if="userInfo.tipo !== 'admin'" class="text-none border mb-8"
                            prepend-icon="mdi-download" rounded="xs" elevation="2"
                            :style="{ backgroundColor: '#f4f4f4', color: 'black' }">
                            Baixar Dados de Produção
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="userInfo.tipo === 'admin'" class="text-none border" prepend-icon="mdi-arrow-right"
                            @click="router.push(`/extracao-dados-admin`)" rounded="xs" elevation="2"
                            :style="{ backgroundColor: '#ddf0c7', color: 'black' }">
                            Ir para Extração de Dados - Visão de Administrador
                        </v-btn>

                        <div v-if="producoesData.length">
                            <div v-for="(producao, index) in producoesData" :key="producao.id" class="borda-producao">
                                <h3 class="mb-2" style="text-align: center;">Mapa de Produção {{ producao.id }}</h3>
                                <h4>Data Inicial do Lote: {{ new Date(producao.dataInicial +
                                    'T00:00:00').toLocaleDateString('pt-BR') }}
                                </h4>
                                <h4>Data Final do Lote: {{ new Date(producao.dataFinal +
                                    'T00:00:00').toLocaleDateString('pt-BR') }}</h4>
                                <div class="mb-5"></div>
                                <v-data-table class="d-flex align-center" :headers="headers" :hide-default-footer="true"
                                    :items-per-page="-1" :items="producao.producaoEmbarcacaoEspecies.map(item => ({
                                        especie: item.especie?.nomeComum,
                                        embarcacao: item.embarcacao?.rgp,
                                        peso: `${item.peso} kg`
                                    }))" item-value="id"></v-data-table>
                            </div>
                        </div>
                    </template>
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
const sessionUserId = localStorage.getItem('sessionUserId');
const producoesData = ref([]);
const userInfo = ref('');
const hasAccess = ref(true);
const headers = ref([
    { title: 'Espécie', value: 'especie' },
    { title: 'Embarcação (RGP)', value: 'embarcacao' },
    { title: 'Peso (kg)', value: 'peso' },
]);


const loadConsultas = async () => {
    try {
        const response = await APICalls.getConsultas(sessionUserId);
        if (response.status === 200) {
            producoesData.value = response.data.producoes;
            hasAccess.value = true;
        }
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            hasAccess.value = false;
        } else {
            console.error("Erro inesperado:", error);
        }
    }
};

const loadUserInfo = async () => {
    try {
        const response = await APICalls.getUser(sessionUserId);
        if (response.status === 200) {
            userInfo.value = response.data.user;
            console.log(userInfo.value.tipo)
        }
    } catch (error) {
        console.error("Erro ao carregar informações do usuário:", error);
    }
};

onMounted(() => {
    loadUserInfo();
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
