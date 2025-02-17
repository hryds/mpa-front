<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 ">
                    Login de Usuário
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field :rules="[validateNotNull, validateEmail]" label="E-mail"
                            v-model="formUserLogin.email" required variant="outlined" type="email"></v-text-field>
                        <v-text-field :rules="[validateNotNull]"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" v-model="formUserLogin.password"
                            :type="visible ? 'text' : 'password'" placeholder="Senha" variant="outlined"
                            @click:append-inner="visible = !visible"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="[{ backgroundColor: '#0CCF13', color: 'black' }, !isFormValid ? { opacity: 0.7 } : {}]"
                        :disabled="!isFormValid" @click="loginUser">Entrar</v-btn>
                    <v-btn class="text-none border" @click="router.push(`/cadastro`)" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Cadastrar
                        Novo Usuário</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none border" @click="router.push(`/recuperar-senha`)" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Esqueceu sua senha?</v-btn>
                    <!----<v-btn class="text-none border" @click="router.push(`/cadastro`)" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }">
                        <template #prepend>
                            <img src="@/assets/microsoft.svg" alt="Logo" style="width: 24px; height: 24px;" />
                        </template>
Continue com Microsoft
</v-btn>-->
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog v-model="showErrorModal" max-width="600">
            <v-card>
                <v-card-title class="text-h5">
                    Erro no Login
                </v-card-title>
                <v-card-text>
                    <div style="color: red;">{{ loginErrorMessage }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-none border" rounded="lg" elevation="2"
                        :style="{ backgroundColor: '#f4f4f4', color: 'black' }" @click="showErrorModal = false">Tentar
                        Novamente</v-btn>
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

const visible = ref(false)

const route = useRoute()
const router = useRouter()

const showErrorModal = ref(false);
const loginErrorMessage = ref('');

const formUserLogin = ref({
    email: '',
    password: ''
});

const isFormValid = computed(() => formUserLogin.value.email.trim() !== '' && formUserLogin.value.password.trim() !== '');

const loginUser = async () => {
    try {
        const response = await APICalls.auth(formUserLogin.value);
        console.log('Resposta do backend:', response.data);
        console.log('Access Token:', response.data.accessToken);
        console.log('ID do Usuário:', response.data.foundId);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('isAuthenticated', true);
        router.push(`/reportar-producao`);
    } catch (error) {
        console.error('Erro durante o login:', error.response?.data || error.message);
        loginErrorMessage.value = error.response?.data?.message || "Ocorreu um erro ao tentar fazer login.";
        showErrorModal.value = true;
    }
};

</script>

<style scoped></style>