<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 ">
                    Extração de Dados
                </v-card-title>
                <v-card-actions>
                    <v-btn prepend-icon="mdi-download" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Baixar Dados de Produção</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
const visible = ref(false)
</script>

<style scoped></style>