<template>
  <div style="margin: auto; width: 20%; margin-top: 10px">
    <div style="margin: auto">
      <q-input
        v-model="username"
        standout
        filled
        bg-color="white"
        label="Benutzername"
      ></q-input>
    </div>
    <div class="q-mt-lg">
      <q-input
        v-model="password"
        filled
        standout
        bg-color="white"
        label="Passwort"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>
    <div class="q-mt-lg">
      <q-btn label="Einloggen" color="pink-3" @click="loginSuccess"> </q-btn>
      <q-btn
        class="q-ml-sm"
        label="Registrieren"
        color="pink-3"
        @click="moveToRegister"
      >
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref<string>('');
const password = ref<string>('');
const router = useRouter();
const isPwd = ref<boolean>(true);

function moveToRegister() {
  router.push('/register');
}

onMounted(async () => {
  await axios.get('http://localhost:5000/isloggedin');
});

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
    router.push({ path: '/duetoday' });
    Notify.create('passt');
  } catch (e) {
    Notify.create('nein');
  }
}
</script>

<style scoped></style>
