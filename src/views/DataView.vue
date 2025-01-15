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
                    Extração de Dados
                </v-card-title>
                <v-card-actions>
                    <v-btn class="text-none border" prepend-icon="mdi-download" rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Baixar Dados de Produção</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router"
const visible = ref(false)

const route = useRoute()
const router = useRouter()

</script>

<style scoped></style>