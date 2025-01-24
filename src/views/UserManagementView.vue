<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 ">
                    <v-tooltip text="Voltar">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="24" @click="router.back()">mdi-arrow-left</v-icon>
                        </template>
                    </v-tooltip>
                    Gerenciar Usuários
                </v-card-title>
                <v-card-text>
                    <h5 v-if="selected.length > 0">Selecionados: {{ selected }}</h5>
                    <v-data-table v-model="selected" :headers="headers" :items="usersData" item-key="id" show-select
                        class="elevation-1">
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router"
import APICalls from '@/services/APICalls';


const showModal = ref(false);

const visible = ref(false)
const usersData = ref([])


const route = useRoute()
const router = useRouter()

const selected = ref([]);

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

const statusData = ref({
    status: 'pendente'
});

const isDisabled = computed(() => selected.value.length === 0);

const loadUsers = async () => {
    try {
        const response = await APICalls.getUsers()
        usersData.value = response.data.users
        console.log(usersData.value)
    } catch (error) {
        console.error(error);
    }
}

loadUsers()

const aproveUsers = async () => {
    try {
        statusData.value = { status: 'aprovado' }
        for (const userId of selected.value) {
            console.log(`Aprovado: ${userId}`);
            await APICalls.updateUserStatus(userId, statusData.value);
        }
        selected.value = [];
        loadUsers()
    } catch (error) {
        console.error(error);
    }
}

const rejectUsers = async () => {
    try {
        statusData.value = { status: 'rejeitado' }
        for (const userId of selected.value) {
            console.log(`Rejeitado: ${userId}`);
            await APICalls.updateUserStatus(userId, statusData.value);
        }
        selected.value = [];
        loadUsers()
    } catch (error) {
        console.error(error);
    }
}

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


</script>
