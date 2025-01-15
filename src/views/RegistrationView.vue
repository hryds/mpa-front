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
          Cadastrar Novo Usuário
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Nome da Empresa" required :rules="[validateNotNull]" variant="outlined"></v-text-field>
            <v-text-field label="E-mail" required :rules="[validateNotNull, validateEmail]" variant="outlined"
              type="email"></v-text-field>
            <v-text-field label="CNPJ" required :rules="[validateNotNull, validateCNPJ]"
              variant="outlined"></v-text-field>
            <v-text-field label="RGP" required :rules="[validateNotNull]" variant="outlined"></v-text-field>
            <v-text-field label="Endereço" required :rules="[validateNotNull]" variant="outlined"></v-text-field>
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              placeholder="Senha" variant="outlined" @click:append-inner="visible = !visible" required
              :rules="[validateNotNull]"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="text-none border" rounded="xs" elevation="2"
            :style="{ backgroundColor: '#ddf0c7', color: 'black' }">Salvar</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="text-none border" prepend-icon="mdi-microsoft" @click="router.push(`/cadastro`)" rounded="xs"
            elevation="2" :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Continue com Microsoft</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { validateNotNull, validateEmail, validateCNPJ, validateRGP } from '@/utils.js/validation';
const visible = ref(false)

const route = useRoute()
const router = useRouter()
</script>

<style scoped></style>
