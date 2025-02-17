<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                        <v-tooltip text="Voltar">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="24" @click="router.back()">mdi-arrow-left</v-icon>
                            </template>
                        </v-tooltip>
                        <span class="mx-2">Recuperação de Senha</span>
                    </div>

                </v-card-title>
                <v-card-text>
                    <p class="mb-6 mt-4">Um senha temporária será enviada para seu email. Após recebê-la, use-a para
                        fazer login em sua
                        conta e crie uma nova senha em <router-link to="/gerenciar-conta"
                            class="text-primary text-decoration-none">
                            Gerenciamento de Conta.
                        </router-link></p>
                    <v-form>
                        <v-text-field label="E-mail" v-model="email" :rules="[validateNotNull, validateEmail]" required
                            variant="outlined" type="email"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="[{ backgroundColor: '#0CCF13', color: 'black' }, !isFormValid ? { opacity: 0.7 } : {}]"
                        @click="resetPassword" :disabled="!isFormValid">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-card-title>{{ title }}</v-card-title>
                <v-card-text>{{ message }}</v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="handleClose">
                        {{ isSuccess ? 'Fechar' : 'Tentar Novamente' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { validateNotNull, validateEmail } from '@/utils.js/validation';
import APICalls from '@/services/APICalls';

const dialog = ref(false);
const title = ref(""); 
const message = ref("");
const isSuccess = ref(false);

const email = ref("");
const router = useRouter();
const isFormValid = computed(() => validateNotNull(email.value) === true && validateEmail(email.value) === true);

const resetPassword = async () => {
    try {
        const response = await APICalls.resetUserPassword({ email: email.value });
        title.value = "Recuperação de Senha";
        message.value = "Uma senha temporária foi enviada para seu email. Verifique sua caixa de entrada.";
        isSuccess.value = true;
    } catch (error) {
        title.value = "Erro";
        message.value = error.response?.data?.message || "Ocorreu um erro ao enviar a solicitação.";
        isSuccess.value = false;
    }

    dialog.value = true;
};

const handleClose = () => {
    dialog.value = false;
    if (isSuccess.value) {
        router.push('/'); 
    }
};

</script>


<style scoped></style>
