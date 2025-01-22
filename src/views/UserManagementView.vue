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
                        :style="{ backgroundColor: '#ddf0c7', color: 'black' }">Aprovar Selecionados</v-btn>
                    <v-btn class="text-none border" prepend-icon="mdi-close-thick" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ffbaba', color: 'black' }">Rejeitar Selecionados</v-btn>
                    <v-btn class="text-none border" prepend-icon="mdi-trash-can" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ff7b7b', color: 'black' }">Deleter Selecionados</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import {useRoute, useRouter} from "vue-router"
import { users } from '@/utils.js/data';
import APICalls from '@/services/APICalls';

const visible = ref(false)
const usersData = ref([])


const route = useRoute()
const router = useRouter()

const selected = ref([]);

const headers = ref([
    { title: "ID", value: "id", sortable: true },
    { title: "Nome", value: "nome", sortable: true },
    { title: "Email", value: "email" },
    { title: "Status", value: "status", sortable: true  },
    { title: "Tipo", value: "tipo" },
    { title: "CNPJ", value: "cnpj", sortable: true },
    { title: "RGP", value: "rgp", sortable: true },
    { title: "CEP", value: "cep" },
]);

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

</script>
