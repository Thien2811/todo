<template>
  <tr class="listeneintrag">
    <div v-if="!editMode">{{ list.listname }}</div>
    <q-input
      v-if="editMode"
      v-model="list.listname"
      standout
      bg-color="white"
      filled
      label="Neuer Listenname"
    ></q-input>
    <div style="margin-left: auto; margin-right: 0">
      <q-btn
        size="25px"
        v-if="!editMode"
        color="primary"
        icon="edit"
        @click="editListname()"
      ></q-btn>
      <q-btn
        size="25px"
        v-if="editMode"
        color="primary"
        icon="save"
        @click="editListname()"
      ></q-btn>
      <q-btn
        size="25px"
        color="primary"
        icon="shortcut"
        @click="moveToList(list.listname)"
      ></q-btn>
      <q-btn
        size="25px"
        class="listenbutton"
        color="primary"
        icon="delete"
        @click="removeList(list.uuid)"
      ></q-btn>
    </div>
  </tr>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';

import { useRouter } from 'vue-router';

import axios from 'axios';

const props = defineProps(['list']);
const list = toRef(props.list);
const emit = defineEmits(['delete']);
const editMode = ref<boolean>(false);
const router = useRouter();

async function removeList(searchValue: string): Promise<void> {
  emit('delete', searchValue);
}

function moveToList(direction: string): string {
  router.push({
    path: '/list',
    query: { listname: `${direction}`, uuid: props.list.uuid },
  });
  return direction;
}

async function editListname() {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    await axios.post('/savelistname', {
      id: props.list.uuid,
      listname: props.list.listname,
    });
  }
}
</script>

<style scoped>
.listeneintrag {
  font-size: 300%;
  display: flex;
  background-color: white;
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
}
</style>
