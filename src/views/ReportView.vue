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
                    Reportar Produção
                </v-card-title>
            </v-card>
        </v-container>
        <v-container outlined>
            <v-card color="#00a65a">
                <v-card-title class="text-h5 ">
                    Informações de Acesso
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-card-text>
                    <span class="font-weight-bold">Nome da Empresa: </span>Empresa 1<br>
                    <span class="font-weight-bold">Email: </span>admin@empresa.com<br>
                    <span class="font-weight-bold">CNPJ: </span>99.187.675/0601-83<br>
                    <span class="font-weight-bold">RGP: </span>AA12696691<br>
                    <span class="font-weight-bold">Data e Hora de Acesso: </span><br>
                </v-card-text>
            </v-card>
        </v-container>

        <v-container outlined>
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
                                <v-text-field v-model="dataInicial" label="Data Inicial do Lote" required
                                    variant="outlined" type="date" :rules="[validateNotNull]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="dataFinal" label="Data Final do Lote" required variant="outlined"
                                    type="date" :rules="[validateDataFinal]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-container>


        <v-container outlined>
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
                                :style="{ backgroundColor: '#ffbaba', color: 'black' }">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-btn class="text-none border" rounded="xs" elevation="2"
                                :style="{ backgroundColor: '#f4f4f4', color: 'black' }"
                                :disabled="embarcacoes.length >= 10" @click="addEmbarcacao">
                                + Adicionar Embarcação
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>


        <!--

        <v-container outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5 ">
                    Espécies Comercializadas Por Embarcação (Kg)
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-form v-model="valid">
                    <v-container>
                        <v-row class="d-flex align-center justify-start">
                            <v-col v-for="(especie, index) in especies" :key="index" cols="12">
                                <v-row class="border py-2">
                                    <v-col cols="2" class="d-flex align-center">
                                        <v-text>
                                            <span class="font-weight-bold">{{ especie.nome }}</span>
                                        </v-text>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">Embarcação (a)</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">Embarcação (b)</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">Embarcação (c)</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">Embarcação (d)</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">Embarcação (e)</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>

                </v-form>
            </v-card>
        </v-container> -->

        <v-container outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5">
                    Espécies Comercializadas Por Embarcação (Kg)
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-form v-model="valid">
                    <v-container>
                        <v-row class="d-flex align-center justify-start">
                            <v-col v-for="(especie, index) in especies" :key="index" cols="12">
                                <v-row class="border py-2">
                                    <v-col cols="2" class="d-flex align-center">
                                        <v-text>
                                            <span class="font-weight-bold">{{ especie.nome }}</span>
                                        </v-text>
                                    </v-col>
                                    <v-col v-for="(embarcacao, idx) in embarcacoes" :key="idx" cols="2">
                                        <v-text>
                                            <span class="font-weight-bold">{{ 'Embarcação (' + (idx + 1) + ')' }}</span>
                                        </v-text>
                                        <v-text-field label="Kg" variant="outlined" type="number"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-container>


        <v-container outlined>
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5 ">
                    Anexar Nota Fiscal
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-file-input required label="Selecionar Arquivos"></v-file-input>
            </v-card>
        </v-container>


        <v-container>
            <v-card>
                <v-card-actions>
                    <v-btn class="text-none border" prepend-icon="mdi-content-save-outline" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ddf0c7', color: 'black' }">Enviar</v-btn>
                </v-card-actions></v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { validateNotNull, validateRGP } from '@/utils.js/validation';
import { useRoute, useRouter } from "vue-router"
import { especies } from '@/utils.js/data';

const valid = ref(true);
const dataInicial = ref("");
const dataFinal = ref("");
const visible = ref(false)

const route = useRoute()
const router = useRouter()

const validateDataFinal = (value) => {
    if (!value) {
        return "Obrigatório";
    }
    if (dataInicial.value && value <= dataInicial.value) {
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

</script>
