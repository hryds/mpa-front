<script setup>
import axios from 'axios';
import { ref } from 'vue';
import APICalls from '@/services/APICalls';

const usersData = ref('')
const producoesData = ref('');
const userData = ref('')

const loadConsultas = async () => {
  try {
    const response = await APICalls.getConsultas(1);
    producoesData.value = response.data.producoes
    console.log(producoesData.value)
  } catch (error) {
    console.error(error);
  }
}

loadConsultas()

const loadUsers = async () => {
  try {
    const response = await APICalls.getUsers()
    usersData.value = response.data.users
    console.log(usersData.value)
  } catch (error) {
    console.error(error);
  }
}

//loadUsers()

const loadUser = async (id) => {
  try {
    const response = await APICalls.getUser(id);
    userData.value = response.data.user;
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
};

//loadUser(1);
const createEspecie = () => {
  axios.post(
    'http://localhost:3000/especies',
    {
      "nomeComum": "Agulhão branco",
      "nomeCientifico": "Kajikia albida",
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
};

const formUserRegisterData = ref({
  nome: '',
  email: '',
  cnpj: '',
  rgp: '',
  cep: '',
  complemento: '',
  tipo: 'comum',
  password: '',
  status: 'pendente'
});


const salvarUsuario = async () => {
  try {
    const response = await APICalls.createUser(formUserRegisterData.value);
    console.log('Usuário criado com sucesso:', response.data);
    Object.keys(formUserRegisterData.value).forEach(key => {
      formUserRegisterData.value[key] = '';
    });
  } catch (error) {
    console.error('Erro ao salvar o usuário:', error);
  }
};




</script>

<template>
  <main>
    <div>
      <div v-if="usersData">
        <p><strong>Dados</strong> {{ producoesData }}</p>

      </div>
    </div>
    <div>
      <div v-if="userData">
        <p><strong>Usuário:</strong> {{ userData }}</p>
      </div>
    </div>
    <div>
      <button @click="createEspecie">enviar</button>
    </div>
  </main>
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
          <v-text-field class="pb-2" v-model="formUserRegisterData.nomeEmpresa" label="Nome da Empresa" required
            :rules="[validateNotNull]" variant="outlined"></v-text-field>
          <v-text-field class="pb-2" v-model="formUserRegisterData.email" label="E-mail" required
            :rules="[validateNotNull, validateEmail]" variant="outlined" type="email"></v-text-field>
          <v-text-field label="CNPJ" v-model="formUserRegisterData.cnpj" required
            :rules="[validateNotNull, validateCNPJ]" variant="outlined"></v-text-field>
          <v-text-field class="pb-2" v-model="formUserRegisterData.rgp" label="RGP" required
            :rules="[validateNotNull, validateRGP]" variant="outlined"></v-text-field>
          <v-text-field class="pb-2" label="CEP" v-model="formUserRegisterData.cep" required
            :rules="[validateNotNull, validateCEP]" variant="outlined"></v-text-field>
          <v-text-field class="pb-2" label="Complemento Endereço" v-model="formUserRegisterData.complemento" required
            :rules="[validateNotNull]" variant="outlined"></v-text-field>
          <v-text-field class="pb-2" v-model="formUserRegisterData.senha"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            placeholder="Senha" variant="outlined" @click:append-inner="visible = !visible" required
            :rules="[validateNotNull]"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="text-none border" prepend-icon="mdi-content-save-outline" rounded="xs" elevation="2"
          :style="{ backgroundColor: '#ddf0c7', color: 'black' }" @click="salvarUsuario">Salvar</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="text-none border" @click="router.push(`/cadastro`)" rounded="xs" elevation="2"
          :style="{ backgroundColor: '#f4f4f4', color: 'black' }">
          <template #prepend>
            <img src="@/assets/microsoft.svg" alt="Logo" style="width: 24px; height: 24px;" />
          </template>
          Continue com Microsoft
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  


</template>
