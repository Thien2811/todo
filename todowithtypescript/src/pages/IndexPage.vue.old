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
  <ListnameComponent
    v-for="list of lists"
    :key="list.uuid"
    :list="list"
    @delete="removeList($event)"
  ></ListnameComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ListnameComponent from 'src/components/ListnameComponent.vue';

import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';

type List = {
  uuid: string;
  listname: string;
};

onMounted(async () => {
  const res = await axios.get('getlistnames');
  res.data.forEach((element: List) => {
    lists.value.push(element);
  });
});

const listname = ref('');
const lists = ref<List[]>([]);

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

.listenbutton {
  margin-left: auto;
  margin-right: 0;
}
</style>
