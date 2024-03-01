<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>{{ currentPage }}</q-toolbar-title>
        <div class="scrolling-container">
          <q-toolbar-title class="scrolling-text"
            >{{ location }} ,
            {{ new Date().toLocaleString('de').split(',')[0] }} , {{ date }} ,
            {{ temperatur }}°C
            <!-- <q-icon name="sunny"></q-icon>
          <q-icon name="umbrella"></q-icon>
          <q-icon name="air"></q-icon>
          <q-icon style="width: 500px" name="partly_cloudy_day"></q-icon> -->
          </q-toolbar-title>
        </div>
        <q-btn class="float-right" icon="download" @click="download"></q-btn>
        <q-btn
          v-if="currentPage != ''"
          class="float-right"
          icon="logout"
          @click="logout"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="currentPage != ''"
      v-model="drawer"
      show-if-above
      :width="200"
      style="border-right: 2px solid black"
    >
      <div style="display: flex; flex-direction: column">
        <div class="q-pa-md"></div>
        <div class="permlist bg-pink-3 text-center" @click="loadDueTodayTask">
          Heute
        </div>
        <div class="permlist bg-pink-3 text-center" @click="loadListAtDate">
          7-Tage-Vorschau
        </div>
        <div class="permlist bg-pink-3 text-center" @click="loadTimeline">
          Alle Tasks
        </div>
        <div class="permlist bg-pink-3 text-center" @click="loadFinishedTask">
          Abgeschlossen
        </div>

        <div>
          <q-btn
            @click="prompt = true"
            icon="add"
            filled
            flat
            style="width: 100%"
          ></q-btn>
          <div
            v-if="lists.length === 0"
            class="text-white text-subtitle1 text-center"
          >
            Keine Listen
          </div>
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
                  @click="addNewList"
                  label="Hinzufügen"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <q-list style="flex-grow: 1; overflow: auto">
          <VueDraggableNext v-model="lists">
            <ListnameComponent
              v-for="list of lists"
              :key="list.uuid"
              :list="list"
              @delete="removeList(list.uuid)"
            ></ListnameComponent>
          </VueDraggableNext>
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
import { ref, onMounted, watch } from 'vue';
import ListnameComponent from 'src/components/ListnameComponent.vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { VueDraggableNext } from 'vue-draggable-next';
import { useRouter, useRoute } from 'vue-router';

type List = {
  uuid: string;
  listname: string;
};

const router = useRouter();
const drawer = ref<boolean>(false);
const listname = ref('');
const lists = ref<List[]>([]);
const prompt = ref<boolean>(false);
const route = useRoute();
const currentPage = ref<string>('');
const location = ref<string>('');
const temperatur = ref<string>('');
const date = ref(new Date().toLocaleString('de'));
// const icon = ref<string>('');

onMounted(async () => {
  const res = await axios.get('getlistnames');
  res.data.forEach((element: List) => {
    lists.value.push(element);
  });

  const weatherdata = await fetch(
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Schwabm%C3%BCnchen?unitGroup=metric&key=WNWVR6D2K56NSY5WKNVV988KS&contentType=json'
  ).then((res) => res.json());

  location.value = weatherdata.address;
  temperatur.value = weatherdata.currentConditions.temp;

  // const keywords = weatherdata.currentConditions.conditions.split(' ');
  // console.log(keywords);

  setInterval(() => {
    date.value = new Date()
      .toLocaleString('de')
      .split(',')[1]
      .split(':')
      .splice(0, 2)
      .join(':');
  }, 1000);
});

watch(useRouter().currentRoute, () => {
  const currentRoute = route.name;
  switch (currentRoute) {
    case 'timeline':
      currentPage.value = 'Alle Tasks';
      break;
    case 'duetoday':
      currentPage.value = 'Heute';
      break;
    case 'dueatdate':
      currentPage.value = 'Nächste 7 Tage';
      break;
    case 'finishedtask':
      currentPage.value = 'Abgeschlossen (letzte 14 Tage)';
      break;
    case 'list':
      currentPage.value = 'ToDo';
      break;
    default:
      currentPage.value = '';
      break;
  }
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
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', title);
  link.click();
}

function loadListAtDate() {
  router.push('/dueatdate');
}

async function logout() {
  await axios.get('/logout');
  window.location.reload();
}
</script>

<style scoped>
.meinelistenschrift {
  font-weight: bold;
  color: white;
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
  color: black;
  margin: 13px;
  padding: 14px;
  font-weight: bold;
}

aside.q-drawer.q-drawer--left.q-drawer--standard {
  backdrop-filter: blur(20px) brightness(130%);

  background-color: transparent;
}

.q-page-container {
  height: 50%;
}

.scrolling-text {
  white-space: nowrap; /* Verhindert Zeilenumbrüche */
  overflow: hidden; /* Versteckt den Text, der über die Grenzen hinausgeht */
  animation: scrollText 20s linear infinite; /* Animationseigenschaften anpassen */
}

@keyframes scrollText {
  from {
    transform: translateX(
      100%
    ); /* Startposition (aus dem Sichtfeld nach rechts) */
  }
  to {
    transform: translateX(
      -100%
    ); /* Endposition (aus dem Sichtfeld nach links) */
  }
}

.scrolling-container {
  width: 400px; /* Breite des Containers anpassen */
  margin-right: 10px;
  overflow: hidden; /* Versteckt den Text, der über die Grenzen hinausgeht */
}
</style>
