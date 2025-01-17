<script setup>
import axios from 'axios';
import { ref } from 'vue';
import APICalls from '@/services/APICalls';

const usersData = ref('')
const userData = ref('')


const loadUsers = async () =>{
  try {
    const response = await APICalls.getUsers()
    usersData.value = response.data.users
    console.log(usersData.value)
  } catch (error) {
    console.error(error);
  }
}

loadUsers()

const loadUser = async (id) => {
  try {
    const response = await APICalls.getUser(id);
    userData.value = response.data.user;
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
};

loadUser(1);
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


</script>

<template>
  <main>
    <div>
      <div v-if="usersData">
      <p><strong>Usuários</strong> {{ usersData }}</p>

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
</template>
