<template>
  <h1>Login</h1>
  <div class="containerr">
    <div style="margin-bottom: 10px">
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
    <div style="margin-top: 20px">
      <q-btn
        style="width: 192px; margin-right: 16px"
        label="Einloggen"
        color="primary"
      >
      </q-btn>
      <q-btn
        style="width: 192px"
        label="Registrieren"
        color="primary"
        @click="moveToRegister"
      >
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref<string>('');
const password = ref<string>('');
const router = useRouter();

function moveToRegister() {
  router.push('/register');
}
</script>

<style scoped>
h1 {
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 1000%;
}
.containerr {
  margin: auto;
  max-width: 400px;
}
</style>
