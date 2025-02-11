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
                        <span class="mx-2">Gerenciar Usuários</span>
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

                        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                            variant="outlined" density="compact" hide-details single-line></v-text-field>
                        <h5 v-if="selected.length > 0">Selecionados: {{ selected }}</h5>

                        <v-data-table v-model="selected" :headers="headers" :items="usersData" item-key="id" show-select
                            class="elevation-2 mt-4 mb-4" :items-per-page="50" :search="search"
                            :header-props="{ style: { fontWeight: 'bold', backgroundColor: '#f4f4f4' } }"> <template
                                v-slot:item.status="{ item }">
                                <v-chip :color="getColor(item.status)">
                                    {{ item.status }}
                                </v-chip>
                            </template>
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
                    <!--<v-btn class="text-none border" prepend-icon="mdi-trash-can" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#ff7b7b', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="openModal">Deletar
                        Selecionados</v-btn>-->
                    <v-btn class="text-none border" prepend-icon="mdi-security" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#5775FA', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="makeUserAdmin">Tornar Administrador</v-btn>
                    <v-btn class="text-none border" prepend-icon="mdi-shield-remove" rounded="xs" elevation="2"
                        :style="[{ backgroundColor: '#ffbaba', color: 'black' }, isDisabled ? { opacity: 0.7 } : {}]"
                        :disabled="isDisabled" @click="removeUserAdmin">Remover Administrador</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-container v-else-if="!loading && !isAdmin">
            <v-card outlined>
                <v-card-title class="text-h5">404 - Página Não Encontrada</v-card-title>
            </v-card>
        </v-container>

        <v-container v-if="loading">
            <v-card outlined>
                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
            </v-card>
        </v-container>


        <v-dialog v-model="showModal" max-width="600">
            <v-card>
                <v-card-title class="text-h5">
                    Confirmação de Exclusão
                </v-card-title>
                <v-card-text>
                    Tem certeza que deseja excluir o(s) usuário(s) {{ selected }}? A operação não poderá ser desfeita
                    após a confirmação.
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ffbaba', color: 'black' }" text
                        @click="closeModal">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none border" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ddf0c7', color: 'black' }" text
                        @click="deleteUsers">Prosseguir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import APICalls from '@/services/APICalls';

const router = useRouter();
const showModal = ref(false);
const usersData = ref([]);
const selected = ref([]);
const userInfo = ref('');
const hasAccess = ref(false);
const headers = ref([
    { title: "ID", value: "id", sortable: true },
    { title: "Nome", value: "nome", sortable: true },
    { title: "Email", value: "email", sortable: true },
    { title: "Status", value: "status", sortable: true },
    { title: "Tipo", value: "tipo", sortable: true },
    { title: "CNPJ", value: "cnpj", sortable: true },
    { title: "RGP", value: "rgp", sortable: true },
    { title: "CEP", value: "cep", sortable: true },
]);

const loading = ref(true);
const isAdmin = ref(false);
const currentUserID = ref(0);

const isDisabled = computed(() => selected.value.length === 0);

const search = ref('');

const getColor = (status) => {
    switch (status) {
        case 'pendente': return 'orange';
        case 'aprovado': return 'green';
        case 'rejeitado': return 'red';
        default: return 'gray';
    }
};

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
            hasAccess.value = false;
        }
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

loadUsers();

onMounted(async () => {
    await getUserID();
    await loadUserInfo();
    if (isAdmin.value) {
        await loadUsers();
        loading.value = false;
    }
    loading.value = false;
});
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

const makeUserAdmin = async () => {
    try {
        for (const userId of selected.value) {
            await APICalls.updateUserType(userId, { tipo: 'admin' });
        }
        selected.value = [];
        loadUsers();
    } catch (error) {
        console.error(error);
    }
};

const removeUserAdmin = async () => {
    try {
        for (const userId of selected.value) {
            await APICalls.updateUserType(userId, { tipo: 'comum' });
        }
        selected.value = [];
        loadUsers();
    } catch (error) {
        console.error(error);
    }
};


const openModal = () => {
    showModal.value = true;
}

const closeModal = () => {
    showModal.value = false;
}

const deleteUsers = async () => {
    closeModal()
    try {
        for (const userId of selected.value) {
            console.log(`Deletado: ${userId}`);
            await APICalls.deleteUser(userId);
        }
        selected.value = [];
        loadUsers()
    } catch (error) {
        console.error(error);
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


</script>
