<template>
  <v-app>
    <v-container>
      <v-card outlined>
        <v-card-title class="text-h5 ">
          Cadastrar Novo Usuário
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Nome da Empresa" required variant="outlined"></v-text-field>
            <v-text-field label="E-mail" required variant="outlined" type="email"></v-text-field>
            <v-text-field label="CNPJ" required variant="outlined"></v-text-field>
            <v-text-field label="RGP" required variant="outlined"></v-text-field>
            <v-text-field label="Endereço" required variant="outlined"></v-text-field>
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              placeholder="Senha" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="text-none" rounded="xs" elevation="2" :style="{ backgroundColor: '#ddf0c7', color: 'black' }">Salvar</v-btn>
          <v-btn class="text-none" rounded="xs" elevation="2" :style="{ backgroundColor: '#f4f4f4', color: 'black' }">Voltar para
            Login</v-btn>
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
