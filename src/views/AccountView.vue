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
                    Gerenciamento de Conta
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
                        <v-btn v-if="userInfo.tipo === 'admin'" class="text-none border" prepend-icon="mdi-arrow-right"
                            @click="router.push(`/gerenciar-usuarios`)" rounded="xs" elevation="2"
                            :style="{ backgroundColor: '#ddf0c7', color: 'black' }">
                            Ir para Gerenciamento de Usuários - Visão de Administrador
                        </v-btn>
                    </template>
                </v-card-text>
            </v-card>


        </v-container>

        <v-container v-if="hasAccess">
            <v-card color="#3b8dbb">
                <v-card-title class="text-h5">Informações da Conta</v-card-title>
            </v-card>

            <v-card color="white">
                <v-card-text>
                    <template v-if="!isEditing">
                        <p><span class="font-weight-bold">Nome: </span>{{ userInfo.nome }}</p>
                        <p><span class="font-weight-bold">Email: </span>{{ userInfo.email }}</p>
                        <p><span class="font-weight-bold">CNPJ: </span>{{ userInfo.cnpj }}</p>
                        <p><span class="font-weight-bold">RGP: </span>{{ userInfo.rgp }}</p>
                        <p><span class="font-weight-bold">CEP: </span>{{ userInfo.cep }}</p>
                        <p><span class="font-weight-bold">Complemento de Endereço: </span>{{ userInfo.complemento }}</p>

                        <v-card-actions class="d-flex mt-4">
                            <v-btn class="text-none border" prepend-icon="mdi-pencil" rounded="xs" elevation="2"
                                :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="toggleEdit">
                                Editar Informações
                            </v-btn>
                        </v-card-actions>
                    </template>
                    <template v-else>
                        <v-form ref="form">
                            <v-text-field :rules="[validateNotNull]" v-model="editedUser.nome" label="Nome" outlined
                                dense></v-text-field>
                            <v-text-field :rules="[validateNotNull, validateEmail]" v-model="editedUser.email"
                                label="Email" outlined dense></v-text-field>
                            <v-text-field :rules="[validateNotNull, validateCNPJ]" v-model="editedUser.cnpj"
                                label="CNPJ" outlined dense></v-text-field>
                            <v-text-field :rules="[validateNotNull, validateRGP]" v-model="editedUser.rgp" label="RGP"
                                outlined dense></v-text-field>
                            <v-text-field :rules="[validateNotNull, validateCEP]" v-model="editedUser.cep" label="CEP"
                                outlined dense></v-text-field>
                            <v-text-field :rules="[validateNotNull]" v-model="editedUser.complemento"
                                label="Complemento de Endereço" outlined dense></v-text-field>

                            <v-card-actions class="d-flex justify-end">
                                <v-btn class="text-none border" rounded="xs" elevation="2"
                                    :style="{ backgroundColor: '#ff7b7b', color: 'black' }" @click="cancelEdit">
                                    Cancelar
                                </v-btn>
                                <v-btn class="text-none border" rounded="xs" elevation="4"
                                    :style="{ backgroundColor: '#ddf0c7', color: 'black' }" @click="openConfirmDialog">
                                    Salvar
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </template>
                </v-card-text>
            </v-card>
        </v-container>
        <v-dialog v-model="confirmDialog" max-width="600px">
            <v-card>
                <v-card-title class="text-h5">Confirmar Alterações</v-card-title>
                <v-card-text>
                    <p><span class="font-weight-bold">Nome: </span>{{ editedUser.nome }}</p>
                    <p><span class="font-weight-bold">Email: </span>{{ editedUser.email }}</p>
                    <p><span class="font-weight-bold">CNPJ: </span>{{ editedUser.cnpj }}</p>
                    <p><span class="font-weight-bold">RGP: </span>{{ editedUser.rgp }}</p>
                    <p><span class="font-weight-bold">CEP: </span>{{ editedUser.cep }}</p>
                    <p><span class="font-weight-bold">Complemento: </span>{{ editedUser.complemento }}</p>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn class="text-none border" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ff7b7b', color: 'black' }" @click="confirmDialog = false">
                        Cancelar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none border" rounded="xs" elevation="4"
                        :style="{ backgroundColor: '#ddf0c7', color: 'black' }" @click="confirmSave">
                        Confirmar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showErrorModal" max-width="600">
            <v-card>
                <v-card-title class="text-h5">
                    Falha ao Atualizar Informações
                </v-card-title>
                <v-card-text>
                    Erro: {{ loginErrorMessage }}
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="showErrorModal = false">Tentar
                        Novamente</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { validateNotNull, validateCNPJ, validateEmail, validateRGP, validateCEP } from "@/utils.js/validation";
import APICalls from "@/services/APICalls";

const router = useRouter();
const hasAccess = ref(true);
const isEditing = ref(false);
const confirmDialog = ref(false);
const sessionUserId = localStorage.getItem('sessionUserId');
const showErrorModal = ref(false);
const loginErrorMessage = ref('');
const userInfo = ref({});
const editedUser = ref({});

const loadUserInfo = async () => {
    try {
        const response = await APICalls.getUser(sessionUserId);
        if (response.status === 200) {
            userInfo.value = response.data.user;
            editedUser.value = { ...response.data.user };
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

const toggleEdit = () => {
    isEditing.value = true;
};

const cancelEdit = () => {
    editedUser.value = { ...userInfo.value };
    isEditing.value = false;
};

const openConfirmDialog = () => {
    confirmDialog.value = true;
};

const confirmSave = async () => {
    confirmDialog.value = false;
    try {
        const response = await APICalls.updateUserNoPassword(sessionUserId, editedUser.value);
        if (response.status === 200) {
            userInfo.value = { ...editedUser.value };
            isEditing.value = false;
        }
    } catch (error) {
        console.error("Erro ao atualizar informações:", error);
        loginErrorMessage.value = error.response?.data?.message || "Ocorreu um erro ao tentar fazer login.";
        showErrorModal.value = true;
    }
};

onMounted(() => {
    loadUserInfo();
});
</script>
