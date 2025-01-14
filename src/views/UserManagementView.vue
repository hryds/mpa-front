<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 ">
                    Gerenciar Usuários
                </v-card-title>
                <v-card-text>
                    <h5>Selecionados: {{ selected }}</h5>
                    <v-data-table v-model="selected" :headers="headers" :items="users" item-key="id" show-select
                        class="elevation-1">
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none" prepend-icon="mdi-check-bold" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ddf0c7', color: 'black' }">Aprovar Selecionados</v-btn>
                    <v-btn class="text-none" prepend-icon="mdi-close-thick" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ffbaba', color: 'black' }">Rejeitar Selecionados</v-btn>
                    <v-btn class="text-none" prepend-icon="mdi-trash-can" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ff7b7b', color: 'black' }">Deleter Selecionados</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
const visible = ref(false)

const selected = ref([]);

const headers = ref([
    { title: "ID", value: "id", sortable: true },
    { title: "Nome", value: "nome", sortable: true },
    { title: "Email", value: "email" },
    { title: "Status", value: "stts" },
    { title: "Tipo", value: "tipo" },
    { title: "CNPJ", value: "cnpj", sortable: true },
    { title: "RGP", value: "rgp", sortable: true },
    { title: "Endereço", value: "endereco" },
]);

const users = ref([
    {
        id: 1,
        email: 'empresa1@email.com',
        nome: 'Empresa 1',
        tipo: 'comum',
        stts: 'pendente',
        cnpj: '99.187.675/0601-43',
        rgp: 'AA12696890',
        endereco: 'Rua ABC Num. 1234',
    },
    {
        id: 2,
        email: 'empresa2@email.com',
        nome: 'Empresa 2',
        tipo: 'comum',
        stts: 'aprovado',
        cnpj: '98.187.675/0601-43',
        rgp: 'AB12696890',
        endereco: 'Rua ABC Num. 1234',
    },
]);

</script>