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
                    Gerenciar Usuários
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
                        <h5 v-if="selected.length > 0">Selecionados: {{ selected }}</h5>
                        <v-data-table v-model="selected" :headers="headers" :items="usersData" item-key="id" show-select
                            class="elevation-1">
                        </v-data-table>
                    </template>
                </v-card-text>
                <v-card-actions v-if="hasAccess">
                    <v-btn class="text-none border" prepend-icon="mdi-check-bold" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#ddf0c7', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="aproveUsers">Aprovar
                        Selecionados</v-btn>
                    <v-btn class="text-none border" prepend-icon="mdi-close-thick" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#ffbaba', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="rejectUsers">Rejeitar
                        Selecionados</v-btn>
                    <v-btn class="text-none border" prepend-icon="mdi-trash-can" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#ff7b7b', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="openModal">Deletar
                        Selecionados</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import APICalls from '@/services/APICalls';

const router = useRouter();
const usersData = ref([]);
const selected = ref([]);
const hasAccess = ref(true);
const headers = ref([
    { title: "ID", value: "id", sortable: true },
    { title: "Nome", value: "nome", sortable: true },
    { title: "Email", value: "email" },
    { title: "Status", value: "status", sortable: true },
    { title: "Tipo", value: "tipo" },
    { title: "CNPJ", value: "cnpj", sortable: true },
    { title: "RGP", value: "rgp", sortable: true },
    { title: "CEP", value: "cep" },
]);

const isDisabled = computed(() => selected.value.length === 0);

const loadUsers = async () => {
    try {
        const response = await APICalls.getUsers();
        if (response.status === 200) {
            usersData.value = response.data.users;
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

loadUsers();

const aproveUsers = async () => {
    try {
        for (const userId of selected.value) {
            await APICalls.updateUserStatus(userId, { status: 'aprovado' });
        }
        selected.value = [];
        loadUsers();
    } catch (error) {
        console.error(error);
    }
};

const rejectUsers = async () => {
    try {
        for (const userId of selected.value) {
            await APICalls.updateUserStatus(userId, { status: 'rejeitado' });
        }
        selected.value = [];
        loadUsers();
    } catch (error) {
        console.error(error);
    }
};
</script>
