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
            <v-text-field class="pb-2" v-model="formUserRegisterData.nome" label="Nome da Empresa" required
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
            <v-text-field class="pb-2" v-model="formUserRegisterData.password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              placeholder="Senha" variant="outlined" @click:append-inner="visible = !visible" required
              :rules="[validateNotNull]"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="text-none border" prepend-icon="mdi-content-save-outline" rounded="xs" elevation="2"
            :style="[{ backgroundColor: '#ddf0c7', color: 'black' }, !isFormValid ? { opacity: 0.7 } : {}]"
            @click="saveUser" :disabled="!isFormValid">Salvar</v-btn>
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

    <v-dialog v-model="showModal" max-width="600">
      <v-card>
        <v-card-title class="text-h5">
          {{ modalTitle }}
        </v-card-title>
        <v-card-text>
          {{ modalMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn class="text-none border" rounded="xs" elevation="2"
            :style="{ backgroundColor: '#f4f4f4', color: 'black' }" text @click="closeModal">{{ modalButtonText
            }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { validateNotNull, validateEmail, validateCNPJ, validateRGP, validateCEP } from '@/utils.js/validation';
import APICalls from '@/services/APICalls';

// Modal 
const modalTitle = ref('');
const modalMessage = ref('');
const modalButtonText = ref('');
const showModal = ref(false);

const closeModal = () => {
  if (modalButtonText.value === 'Prosseguir') {
    router.push('/');
  } else if (modalButtonText.value === 'Tentar Novamente') {
    showModal.value = false;
  }
};

// 

const visible = ref(false)
const route = useRoute()
const router = useRouter()

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

const isFormValid = computed(() => {
  return Object.entries(formUserRegisterData.value).every(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    if (key === 'email' && validateEmail(value) !== true) {
      return false;
    }
    if (key === 'cnpj' && validateCNPJ(value) !== true) {
      return false;
    }
    if (key === 'rgp' && validateRGP(value) !== true) {
      return false;
    }
    if (key === 'cep' && validateCEP(value) !== true) {
      return false;
    }
    return true;
  });
});



const saveUser = async () => {
  try {
    formUserRegisterData.value.rgp = formUserRegisterData.value.rgp.toUpperCase();
    formUserRegisterData.value.cnpj = formUserRegisterData.value.cnpj.replace(/[^0-9]/g, '');
    formUserRegisterData.value.rgp = formUserRegisterData.value.rgp.replace(/[^A-Za-z0-9]/g, '');
    formUserRegisterData.value.cep = formUserRegisterData.value.cep.replace(/[^0-9]/g, '');

    const response = await APICalls.createUser(formUserRegisterData.value);
    modalTitle.value = 'Sucesso';
    modalMessage.value = 'Usuário criado com sucesso!';
    modalButtonText.value = 'Prosseguir';
    showModal.value = true;
    Object.keys(formUserRegisterData.value).forEach(key => {
      formUserRegisterData.value[key] = '';
    });
  } catch (error) {
    modalTitle.value = 'Erro';
    console.log(error);
    modalMessage.value = `Erro ao Cadastrar Usuário: ${error.response?.data?.message || error.message}`;
    modalButtonText.value = 'Tentar Novamente';
    showModal.value = true;
  }
};

</script>

<style scoped></style>
