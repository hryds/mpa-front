<template>
    <v-app>
        <v-container>
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
                    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                    <v-card v-if="!hasAccess && !loading" variant="flat">
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

                    <template v-if="hasAccess && !loading">
                        <v-btn class="text-none border mb-6 mt-2" prepend-icon="mdi-download" rounded="lg" elevation="2"
                            :style="{ backgroundColor: '#3c8bbc', color: 'black' }" @click="generateCSV">
                            Baixar Dados de Produção
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="userInfo.tipo === 'admin'" class="text-none border mb-6"
                            prepend-icon="mdi-arrow-right" @click="router.push(`/extracao-dados-admin`)" rounded="lg"
                            elevation="2" :style="{ backgroundColor: '#0CCF13', color: 'black' }">
                            Ir para Extração de Dados - Visão de Administrador
                        </v-btn>

                        <div v-if="producoesData.length">
                            <div v-for="(producao, index) in producoesData" :key="producao.id" elevation="4">
                                <div v-if="producao.producaoEmbarcacaoEspecies.length" class="borda-producao">
                                    <v-card-title class="text-h6">Mapa de Produção {{ producao.id }}</v-card-title>
                                    <v-card-text>
                                        <p>Data Inicial do Lote: {{ new Date(producao.dataInicial +
                                            'T00:00:00').toLocaleDateString('pt-BR') }}
                                        </p>
                                        <p>Data Final do Lote: {{ new Date(producao.dataFinal +
                                            'T00:00:00').toLocaleDateString('pt-BR') }}</p>
                                        <p>Data de Reporte: {{ new Date(producao.createdAt).toLocaleDateString('pt-BR')
                                        }}
                                        </p>
                                    </v-card-text>
                                    <div class="mb-10"></div>
                                    <v-data-table class="d-flex align-center mb-4"
                                        :header-props="{ style: { fontWeight: 'bold', backgroundColor: '#f4f4f4' } }"
                                        :headers="headers" dense hover :hide-default-footer="true" :items-per-page="-1"
                                        elevation="2" :items="producao.producaoEmbarcacaoEspecies.map(item => ({
                                            especie: item.especie?.nomeComum,
                                            embarcacao: item.embarcacao?.rgp,
                                            peso: `${item.peso} kg`
                                        }))" item-value="id"></v-data-table>
                                </div>
                            </div>
                        </div>

                        <p v-if="producoesData.length === 0">
                            Você ainda não tem dados de produção.
                        </p>
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
const producoesData = ref([]);
const userInfo = ref('');
const hasAccess = ref(false);
const headers = ref([
    { title: 'Espécie', value: 'especie' },
    { title: 'Embarcação (RGP)', value: 'embarcacao' },
    { title: 'Peso (kg)', value: 'peso' },
]);
const currentUserID = ref(0);
const loading = ref(true);

const loadConsultas = async () => {
    try {
        const response = await APICalls.getConsultas(currentUserID.value);
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
        const response = await APICalls.getUser(currentUserID.value);
        if (response.status === 200) {
            userInfo.value = response.data.user;
            console.log(userInfo.value.tipo)
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
        }
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log(error);
            hasAccess.value = false;
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


const generateCSV = () => {
    const header = '"id_producao", "data_inicial_lote", "data_final_lote", "data_reporte", "especie", "rgp", "peso"\n';

    const rows = producoesData.value.flatMap((producao) => {
        return producao.producaoEmbarcacaoEspecies.map((item) => {
            return [
                producao.id,
                new Date(producao.dataInicial + 'T00:00:00').toLocaleDateString('pt-BR'),
                new Date(producao.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR'),
                new Date(producao.createdAt).toLocaleDateString('pt-BR'),
                item.especie?.nomeComum,
                item.embarcacao?.rgp,
                `${item.peso}`,
            ].map((field) => `"${field}"`).join(',');
        });
    }).join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dados_producao.csv';
    link.click();
};

onMounted(async () => {
    await getUserID();
    await loadUserInfo();
    await loadConsultas();
    loading.value = false;
});
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
