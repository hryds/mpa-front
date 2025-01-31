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
        <v-container outlined v-if="hasAccess">
            <v-card v-if="hasAccess" color="#3b8dbb">
                <v-card-title class="text-h5">
                    Informações da Conta
                </v-card-title>
            </v-card>
            <v-card color="white">
                <v-card-text>
                    <span class="font-weight-bold">Nome: </span>{{ userInfo.nome }}<br>
                    <span class="font-weight-bold">Email: </span>{{ userInfo.email }}<br>
                    <span class="font-weight-bold">CNPJ: </span>{{ userInfo.cnpj }}<br>
                    <span class="font-weight-bold">RGP: </span>{{ userInfo.rgp }}<br>
                    <span class="font-weight-bold">CEP: </span>{{ userInfo.cep }}<br>
                    <span class="font-weight-bold">Complemento de Endereço: </span>{{ userInfo.complemento }}<br>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>



<script setup>
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue";
import APICalls from "@/services/APICalls";

const hasAccess = ref(true);

const router = useRouter();
const userInfo = ref('');
const sessionUserId = localStorage.getItem('sessionUserId');

const loadUserInfo = async () => {
    try {
        const response = await APICalls.getUser(sessionUserId);
        if (response.status === 200) {
            userInfo.value = response.data.user;
            console.log(userInfo.value)
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

onMounted(() => {
    loadUserInfo();
});

</script>