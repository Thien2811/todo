<template>
  <div>Registrieren</div>
  <div class="containerr">
    <div>
      <q-input
        v-model="newUsername"
        standout
        filled
        bg-color="white"
        label="Benutzername"
      ></q-input>
    </div>
    <div>
      <q-input
        label="Passwort"
        bg-color="white"
        standout
        v-model="newPassword"
        filled
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
    <div>
      <q-input
        label="Passwort wiederholen"
        bg-color="white"
        standout
        v-model="checkPassword"
        filled
        :type="isPwdd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwdd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwdd = !isPwdd"
          />
        </template>
      </q-input>
    </div>

    <div>
      <q-btn label="Registrieren" color="primary" @click="register"> </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

type User = {
  username: string;
  password: string;
};

const newUsername = ref<string>('');
const newPassword = ref<string>('');
const checkPassword = ref<string>('');
const users = ref<User[]>([]);
const isPwd = ref<boolean>(true);
const isPwdd = ref<boolean>(true);

async function register() {
  if (newPassword.value === checkPassword.value) {
    users.value.push({
      username: newUsername.value,
      password: newPassword.value,
    });
    await axios.post('/register', {
      user: users.value.splice(-1) ?? users.value,
    });
    alert('Registrieren erfolgreich');
  } else {
    alert('Passwörter stimmen nicht überein');
  }
}
</script>

<style scoped></style>
