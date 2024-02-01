<template>
  <div style="background-color: #141010">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header
        elevated
        :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'"
      >
        <q-toolbar>
          <q-toolbar-title>ToDo-Liste</q-toolbar-title>
          <q-btn-dropdown color="primary" icon="person">
            <q-list>
              <q-item
                clickable
                v-close-popup
                text-color="black"
                filled
                v-if="!loginstatus"
              >
                <q-item-section>
                  <q-item-label>Test</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup v-if="!loginstatus">
                <q-item-section>
                  <q-item-label>Test2</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="changeLoginStatus"
                v-if="loginstatus"
              >
                <q-item-section>
                  <q-item-label>Einloggen</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="logout"
                v-if="!loginstatus"
              >
                <q-item-section>
                  <q-item-label>Ausloggen</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="75"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-slategrey'"
        style="color: black; background: black"
      >
        <div class="button">
          <q-btn
            size="150%"
            standout
            color="primary"
            @click="moveToAllTasks"
            icon="format_list_numbered"
          />
        </div>
        <div class="button">
          <q-btn
            size="150%"
            standout
            color="primary"
            @click="moveToCreateTaskAndList"
            icon="playlist_add"
          />
        </div>
        <div class="button">
          <q-btn
            size="150%"
            standout
            color="primary"
            @click="moveToCompletedTaskList"
            icon="check"
          />
        </div>
      </q-drawer>

      <q-page-container>
        <q-page>
          <RouterView />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Cookies } from 'quasar';

const drawer = ref();
const loginstatus = ref(true);

function moveToAllTasks() {
  router.push('/alltask');
}

function moveToCreateTaskAndList() {
  router.push('/createlistandtask');
}

function moveToCompletedTaskList() {
  router.push('/finishedtask');
}

function changeLoginStatus() {
  loginstatus.value = !loginstatus.value;
  if (loginstatus.value) {
    router.push('/');
  }
}

async function logout() {
  const res = await axios.get('/logout');
  console.log(res);
  Cookies.remove('connect.sid');
  Cookies.remove('username');
  router.push('/');
}
</script>

<style scoped>
.button {
  margin-top: 20px;
}

.q-item {
  color: black;
  text-align: center;
}
</style>
