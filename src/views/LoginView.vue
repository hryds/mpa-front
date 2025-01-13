<template>
    <v-app>
        <v-container>
            <v-card outlined>
                <v-card-title class="text-h5 ">
                    Login de Usuário
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field label="E-mail" required variant="outlined" type="email"></v-text-field>
                        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'" placeholder="Senha" variant="outlined"
                            @click:append-inner="visible = !visible"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn rounded="xs" elevation="2"
                        :style="{ backgroundColor: '#ccffcc', color: 'black' }">Entrar</v-btn>
                    <v-btn rounded="xs" elevation="2" :style="{ backgroundColor: '#d9d9d9', color: 'black' }">Cadastrar
                        Novo Usuário</v-btn>
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