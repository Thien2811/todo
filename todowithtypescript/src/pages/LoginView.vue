<template>
  <div>
    <div>
      <q-input
        v-model="username"
        standout
        filled
        bg-color="white"
        label="Benutzername"
      ></q-input>
    </div>
    <div>
      <q-input
        v-model="password"
        standout
        filled
        bg-color="white"
        label="Passwort"
      ></q-input>
    </div>
    <div>
      <q-btn label="Einloggen" color="primary" @click="loginSuccess"> </q-btn>
      <q-btn label="Registrieren" color="primary" @click="moveToRegister">
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Notify } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref<string>('');
const password = ref<string>('');
const router = useRouter();

function moveToRegister() {
  router.push('/register');
}

async function loginSuccess() {
  try {
    const user = await axios.post(
      '/login',
      {
        user: username.value,
        password: password.value,
      },
      { withCredentials: true }
    );
    console.log(user.data);
    router.push('/duetoday');
    Notify.create('passt');
  } catch (e) {
    Notify.create('nein');
  }
}
</script>

<style scoped></style>
