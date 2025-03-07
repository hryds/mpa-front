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
                        <span class="mx-2">Reportar Produção</span>
                    </div>

                    <v-tooltip text="Sair" v-if="hasAccess && !loading">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="28" @click="logoutUser">mdi-logout</v-icon>
                        </template>
                    </v-tooltip>
                </v-card-title>
                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                <v-card-text v-if="!hasAccess && !loading">
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
                </v-card-text>
            </v-card>
        </v-container>

        <v-container outlined v-if="hasAccess">
            <v-card color="#00a65a">
                <v-card-title class="text-h5">
                    Informações de Acesso
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-card-text>
                    <span class="font-weight-bold">Nome da Empresa: </span>{{ userData.nome }}<br>
                    <span class="font-weight-bold">Email: </span>{{ userData.email }}<br>
                    <span class="font-weight-bold">CNPJ: </span>{{ userData.cnpj }}<br>
                    <span class="font-weight-bold">RGP: </span>{{ userData.rgp }}<br>
                    <span class="font-weight-bold">Status: </span>{{ userData.status }}<br>
                    <span class="font-weight-bold">Data e Hora de Acesso: </span>{{ formattedDate }} (Horário Padrão de
                    Brasília)<br>
                </v-card-text>
            </v-card>
        </v-container>

        <v-container v-if="hasAccess && userStatus !== 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5 ">
                    Período do Lote
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-form v-model="valid">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formReportDateData.dataInicial" label="Data Inicial do Lote"
                                    required variant="outlined" type="date" :rules="[validateNotNull]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formReportDateData.dataFinal" label="Data Final do Lote" required
                                    variant="outlined" type="date" :rules="[validateDataFinal]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-container>

        <v-container v-if="hasAccess && userStatus !== 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5">
                    Embarcações
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-container>
                    <v-row v-for="(embarcacao, index) in embarcacoes" :key="index" class="mb-4" align="center">
                        <v-col cols="12" md="5">
                            <v-text>
                                <span class="font-weight-bold">Nome Embarcação</span>
                            </v-text>
                            <v-text-field v-model="embarcacao.nome" :rules=[validateNotNull]
                                :label="'Embarcação (' + (index + 1) + ')'" required variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-text>
                                <span class="font-weight-bold">RGP Embarcação </span>
                            </v-text>
                            <v-text-field v-model="embarcacao.rgp" :label="'RGP - Embarcação (' + (index + 1) + ')'"
                                required :rules="[validateNotNull, validateRGP]" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-btn icon :disabled="embarcacoes.length === 1" @click="removeEmbarcacao(index)"
                                class="text-none border" elevation="2"
                                :style="{ backgroundColor: '#FF2F2B', color: 'black' }">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-btn class="text-none border" rounded="lg" elevation="2"
                                :style="{ backgroundColor: '#f4f4f4', color: 'black' }"
                                :disabled="embarcacoes.length >= 10" @click="addEmbarcacao">
                                + Adicionar Embarcação
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>

        <v-container v-if="hasAccess && userStatus !== 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5">
                    Espécies Comercializadas Por Embarcação (Kg)
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-form v-model="valid">
                    <v-container>
                        <v-row class="d-flex align-center justify-start">
                            <v-col v-for="(especie, index) in especiesData" :key="index" cols="12">
                                <v-row class="border py-2">
                                    <v-col cols="2" class="d-flex align-center">
                                        <v-text>
                                            <span class="font-weight-bold">{{ especie.nomeComum }} </span>
                                            <span class="font-weight-bold" style="font-style:italic">
                                                ({{
                                                    especie.nomeCientifico

                                                }})</span>
                                        </v-text>
                                    </v-col>
                                    <v-col v-for="(embarcacao, idx) in embarcacoes" :key="idx" cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">{{ 'Embarcação (' + (idx + 1) + ')'
                                            }}</span>
                                        </v-text>
                                        <v-text-field variant="outlined" type="number" :min="0.1" :max="300001"
                                            v-model="dados[especie.id][idx]" :rules="[validatePeso]"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-container>

        <v-container v-if="userStatus === 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card color="#ffcc03">
                <v-card-title class="text-h5">
                    Status Pendente
                </v-card-title>
                <v-card-text>
                    Seu cadastro está pendente. Aguarde aprovação para reportar produção.
                </v-card-text>
            </v-card>
        </v-container>

        <v-container v-if="userStatus === 'rejeitado'" outlined>
            <v-card color="#FF2F2B">
                <v-card-title class="text-h5">
                    Status Rejeitado
                </v-card-title>
                <v-card-text>
                    Seu cadastro foi rejeitado. Aguarde aprovação para reportar produção.
                </v-card-text>
            </v-card>
        </v-container>

        <v-container v-if="hasAccess && userStatus !== 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5 ">
                    Anexar Nota Fiscal
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-file-input v-model="selectedFile" persistent-hint
                    hint="Formatos Aceitos: .pdf, .doc, .docx, .png, .odt, .jpg, .xml e .xlsx.   Tamanho máximo: 2MB"
                    show-size accept=".pdf, .doc, .docx, .png, .odt, .jpg, .xml, .xlsx"
                    label="Selecionar Arquivo"></v-file-input>
            </v-card>
        </v-container>

        <v-container v-if="hasAccess && userStatus !== 'pendente' && userStatus !== 'rejeitado'" outlined>
            <v-card>
                <v-card-actions>
                    <v-btn class="text-none border" prepend-icon="mdi-content-save-outline" rounded="lg" elevation="2"
                        :style="[{ backgroundColor: '#0CCF13', color: 'black' }, !isReportFormValid ? { opacity: 0.7 } : {}]"
                        @click="saveReport" :disabled="!isReportFormValid">Enviar</v-btn>
                </v-card-actions></v-card>
        </v-container>

        <v-dialog v-model="successDialog" max-width="600">
            <v-card>
                <v-card-title class="text-h5">Sucesso</v-card-title>
                <v-card-text>
                    Relatório de Produção {{ modalMessage }} enviado.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }"
                        @click="closeSuccessDialog">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="errorDialog" max-width="600">
            <v-card>
                <v-card-title class="text-h5">Erro</v-card-title>
                <v-card-text>
                    <div class="mb-2">Erro ao salvar Relatório de Produção:</div>
                    <div class="mb-2" style="color: red;">{{ modalErrorMessage }}</div>
                    <div>Por favor, tente novamente.</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="closeErrorDialog">Tentar
                        Novamente</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { validateNotNull, validateRGP, validatePeso } from '@/utils.js/validation';
import { useRoute, useRouter } from "vue-router"
import APICalls from '@/services/APICalls';

const producaoId = ref(1);
const reportId = ref(1);
const embarcacoesId = ref([]);
const selectedFile = ref(null);

const successDialog = ref(false);
const errorDialog = ref(false);
const hasAccess = ref(false);
const userStatus = ref('');
const loading = ref(true);
const modalMessage = ref('');

const closeSuccessDialog = () => {
    successDialog.value = false;
    router.push('/reportar-producao');
};

const closeErrorDialog = () => {
    errorDialog.value = false;
    initializeDados();
};


const dados = ref({});

const initializeDados = () => {
    dados.value = {};
    especiesData.value.forEach(especie => {
        dados.value[especie.id] = [];
        embarcacoes.value.forEach((embarcacao, idx) => {
            dados.value[especie.id][idx] = null;
        });
    });
};


const valid = ref(true);
const dataInicial = ref("");
const dataFinal = ref("");
const visible = ref(false)

const modalErrorMessage = ref('');

const userData = ref('')
const route = useRoute()
const router = useRouter()
const currentUserID = ref(0);


const especiesData = ref([]);
const loadEspecies = async () => {
    try {
        const response = await APICalls.getEspecies()
        if (response.status === 200) {
            especiesData.value = response.data.especies
            initializeDados();
            console.log(especiesData.value)
            hasAccess.value = true;
        }
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            hasAccess.value = false;
        } else {
            console.error("Erro inesperado:", error);
        }
    }
}


const formReportDateData = ref({
    "dataInicial": "",
    "dataFinal": ""
});

const formReportProducaoData = ref({
    producaoId: "",
    embarcacaoId: "",
    especieId: "",
    peso: ""
});


const validateDataFinal = (value) => {
    if (!value) {
        return "Obrigatório";
    }
    if (formReportDateData.value.dataInicial && value <= formReportDateData.value.dataInicial) {
        return "A Data Final do Lote deve ser posterior à Data Inicial";
    }
    return true;
};

const embarcacoes = ref([{ nome: '', rgp: '' }]);

const addEmbarcacao = () => {
    if (embarcacoes.value.length < 10) {
        embarcacoes.value.push({ nome: '', rgp: '' });
    }
};

const removeEmbarcacao = (index) => {
    if (embarcacoes.value.length > 1) {
        embarcacoes.value.splice(index, 1);
    }
};

const loadUser = async (id) => {
    try {
        const response = await APICalls.getUser(id);
        if (response.status === 200) {
            userData.value = response.data.user;
            console.log(userData.value);
            userStatus.value = response.data.user.status;
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

onMounted(async () => {
    loading.value = true;
    await getUserID();
    await loadUser(currentUserID.value);
    await loadEspecies();
    loading.value = false;
});


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

var currentDate = new Date();

var formattedDate = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}).format(currentDate);


const uploadFile = async (producaoId) => {
    if (!selectedFile.value) {
        return;
    }
    console.log(producaoId)

    const formData = new FormData();
    formData.append("producaoId", producaoId);
    formData.append("file", selectedFile.value);

    try {
        const response = await APICalls.fileUpload(formData);
    } catch (error) {
        console.error("Erro ao enviar nota fiscal:", error);
    }
};

const saveReport = async () => {
    try {
        const embarcacoesComId = await Promise.all(
            embarcacoes.value.map(async (embarcacao) => {
                if (embarcacao.rgp) {
                    try {
                        const response = await APICalls.getEmbarcacaobyRGP(embarcacao.rgp);
                        if (response.data?.embarcacao) {
                            embarcacao.id = response.data.embarcacao.id;
                            console.log(`Embarcação existente com RGP ${embarcacao.rgp}: ID = ${embarcacao.id}`);
                        } else {
                            const responseCreate = await APICalls.createEmbarcacao(embarcacao);
                            embarcacao.id = responseCreate.data?.embarcacao?.id;
                            console.log(`Embarcação criada com RGP ${embarcacao.rgp}: ID = ${embarcacao.id}`);
                        }
                    } catch (error) {
                        console.error(`Erro ao buscar embarcação com RGP ${embarcacao.rgp}: ${error.message}`);
                        const responseCreate = await APICalls.createEmbarcacao(embarcacao);
                        embarcacao.id = responseCreate.data?.embarcacao?.id;
                        console.log(`Embarcação criada com RGP ${embarcacao.rgp}: ID = ${embarcacao.id}`);
                        modalErrorMessage.value = error.response?.data?.message || "Erro.";
                    }
                } else {
                    console.log("Embarcação sem RGP especificado: Não foi possível verificar ou criar.");
                }
                return embarcacao;
            })
        );

        embarcacoesId.value = embarcacoesComId.map(embarcacao => embarcacao.id);

        console.log('Array de IDs das embarcações:', [...embarcacoesId.value]);
        console.log(dados.value)

        const payload = {
            ...formReportDateData.value,
            userId: currentUserID.value,
            embarcacoes: embarcacoesId.value,
        };

        console.log('Payload a ser enviado:', payload);

        const response = await APICalls.createProducao(payload);
        producaoId.value = response.data?.producao?.id;
        console.log(`Produção criada com ID = ${producaoId.value}`);
        modalMessage.value = `${producaoId.value}`;

        await uploadFile(producaoId.value);

        formReportProducaoData.value.producaoId = producaoId.value;

        Object.keys(dados.value).forEach((especieId) => {
            console.log(`Espécie ${especieId}:`);
            const embarcacoes = dados.value[especieId];
            if (embarcacoes && embarcacoes.length) {
                embarcacoes.forEach(async (valor, idx) => {
                    if (valor !== null) {
                        console.log(`${embarcacoesId.value[idx]}: ${valor}`);
                        console.log('Entrou')
                        formReportProducaoData.value.embarcacaoId = embarcacoesId.value[idx];
                        formReportProducaoData.value.especieId = especieId;
                        formReportProducaoData.value.peso = valor;

                        try {
                            const response = await APICalls.createProducaoEmbarcacaoEspecie(formReportProducaoData.value);
                            reportId.value = response.data?.producaoEmbarcacaoEspecie?.id;
                            console.log(`Report criado com ID = ${reportId.value}`);

                            successDialog.value = true;
                            errorDialog.value = false;
                        } catch (error) {
                            errorDialog.value = true;
                            successDialog.value = false;
                            console.log(error)
                            modalErrorMessage.value = error.response?.data?.message || "Ocorreu um erro ao criar o report.";

                        }

                    }
                });
            } else {
                console.log('Nenhuma embarcação associada.');
            }
        });
    } catch (error) {
        console.error('Erro ao salvar o relatório de produção:', error);
    }
};

const isReportFormValid = computed(() => {
    const isDateDataValid = Object.values(formReportDateData.value).every(
        (value) => value !== '' && value !== null && value !== undefined
    );

    const isDataInicialBeforeDataFinal = formReportDateData.value.dataInicial && formReportDateData.value.dataFinal
        ? formReportDateData.value.dataInicial <= formReportDateData.value.dataFinal
        : true;

    const areAllEmbarcacoesValid = embarcacoes.value.every(embarcacao => {
        const nomeValido = validateNotNull(embarcacao.nome) === true;
        const rgpValido = validateRGP(embarcacao.rgp) === true;

        return nomeValido && rgpValido;
    });

    const hasOneEmbarcacao = embarcacoes.value.some(embarcacao => embarcacao.nome && embarcacao.rgp);

    const isFileValid = !selectedFile.value || selectedFile.value.size <= 2 * 1024 * 1024;

    return isDateDataValid && hasOneEmbarcacao && isDataInicialBeforeDataFinal && areAllEmbarcacoesValid && isFileValid;
});

</script>