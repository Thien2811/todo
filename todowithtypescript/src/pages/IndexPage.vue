<template>
  <h1>Übersicht</h1>
  <div class="container">
    <q-input
      v-model="listname"
      standout
      bg-color="white"
      filled
      label="Listenname"
    ></q-input>
    <q-btn
      @click="addNewList"
      color="primary"
      text-color="black"
      icon="add"
    ></q-btn>
  </div>
  <tr
    class="listeneintrag"
    v-for="(list, index) of lists"
    :key="index"
    :list="list"
  >
    {{
      list
    }}

    <q-btn
      class="button"
      color="primary"
      icon="shortcut"
      @click="moveToList(list)"
    ></q-btn>
    <q-btn
      class="button"
      color="primary"
      icon="delete"
      @click="removeList(list)"
    ></q-btn>
  </tr>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import axios from 'axios';

onMounted(async () => {
  const res = await axios.get('getlistnames');
  res.data.forEach((element: { listname: string }) => {
    lists.value.push(element.listname);
  });
});

const router = useRouter();

const listname = ref('');
const lists = ref<string[]>([]);

async function addNewList(): Promise<void> {
  lists.value.push(listname.value);
  await axios.post('/addlist', { name: listname.value });
}

async function removeList(searchValue: string): Promise<void> {
  const index = lists.value.findIndex((el) => el == searchValue);
  const deletedList = lists.value.splice(index, 1);
  await axios.delete(`/deletelist/${deletedList}`);
}

function moveToList(direction: string): string {
  router.push({ path: '/list', query: { listname: `${direction}` } });
  return direction;
}
</script>

<style scoped>
h1 {
  font-weight: bold;
  color: white;
  text-align: center;
}

.container {
  display: flex;
  justify-content: center;
  margin: auto;
}

.listeneintrag {
  font-size: 300%;
  display: flex;
  background-color: white;
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
}

.button {
  margin-left: auto;
}
</style>
