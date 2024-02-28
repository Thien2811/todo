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
      <q-btn label="Einloggen" color="primary"> </q-btn>
      <q-btn label="Registrieren" color="primary" @click="moveToRegister">
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

<style scoped></style>
