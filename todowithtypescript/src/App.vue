<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>ToDo</q-toolbar-title>
        <q-btn class="float-right" icon="download" @click="download"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      style="background-color: #fff0f5"
    >
      <div
        class="bg-pink-1"
        style="display: flex; flex-direction: column; height: 100%"
      >
        <div
          class="meinelistenschrift bg-pink-1 text-center"
          style="color: black"
        >
          Meine Listen
        </div>
        <div class="permlist text-center" @click="loadDueTodayTask">
          Heute fällig
        </div>
        <div class="permlist text-center" @click="loadTimeline">Timeline</div>
        <div class="permlist text-center" @click="loadFinishedTask">
          Abgeschlossen
        </div>

        <div>
          <q-btn
            @click="prompt = true"
            icon="add"
            filled
            flat
            style="width: 95%"
            label="Neue Liste"
          ></q-btn>
          <q-dialog v-model="prompt" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Neue Liste hinzufügen</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="listname"
                  autofocus
                  @keyup.enter="
                    addNewList();
                    prompt = false;
                  "
                />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Abbrechen" v-close-popup />
                <q-btn
                  flat
                  label="Liste hinzufügen"
                  @click="addNewList"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <q-list style="flex-grow: 1; overflow: auto">
          <ListnameComponent
            v-for="list of lists"
            :key="list.uuid"
            :list="list"
            @delete="removeList(list.uuid)"
          ></ListnameComponent>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ListnameComponent from 'src/components/ListnameComponent.vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';

type List = {
  uuid: string;
  listname: string;
};

const router = useRouter();
const drawer = ref<boolean>(false);
const listname = ref('');
const lists = ref<List[]>([]);
const prompt = ref<boolean>(false);
onMounted(async () => {
  const res = await axios.get('getlistnames');
  res.data.forEach((element: List) => {
    lists.value.push(element);
  });
});

async function addNewList(): Promise<void> {
  lists.value.push({ uuid: uuidv4(), listname: listname.value });
  await axios.post('/addlist', { list: lists.value.slice(-1) ?? lists.value });
}

async function removeList(searchValue: string): Promise<void> {
  const index = lists.value.findIndex((el: List) => {
    return el.uuid === searchValue;
  });
  const deletedList = lists.value.splice(index, 1);
  const deletedListname = deletedList[0].listname;
  await axios.delete(`/deletelist/${deletedListname}`);
}

function loadDueTodayTask() {
  router.push('/duetoday');
}

function loadTimeline() {
  router.push('/timeline');
}

function loadFinishedTask() {
  router.push('/finishedtask');
}

async function download() {
  const title = 'Datenbank';
  const databaseInfo = await axios.get('/download');
  const url = window.URL.createObjectURL(
    new Blob([JSON.stringify(databaseInfo.data, null, '\t')], {
      type: 'application/json',
    })
  );
  console.log(url);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', title);
  link.click();
}
</script>

<style scoped>
.meinelistenschrift {
  font-weight: bold;
  color: white;
  background-color: black;
  font-size: 200%;
}

.q-scrollarea__thumb {
  overflow: hidden;
}
</style>

<style>
::-webkit-scrollbar {
  width: 0;
}

.q-scrollarea__container {
  min-height: 0%;
}

body {
  background-image: url('./pictures/download.png');
  background-size: cover;
}

.permlist {
  background-color: black;
  color: white;
  margin: 13px;
  padding: 14px;
}
</style>
