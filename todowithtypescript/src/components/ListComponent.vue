<template>
  <li class="listcontainer q-gutter-sm">
    {{ list.listname }}
    <q-input
      class="input"
      bg-color="white"
      standout
      filled
      v-model="task.taskname"
      label="Aufgabe"
    ></q-input>
    <q-input
      class="input"
      type="textarea"
      bg-color="white"
      standout
      filled
      v-model="task.description"
      label="Aufgabenbeschreibung"
    ></q-input>
    <q-select
      class="input"
      standout
      bg-color="white"
      v-model="task.addedUser"
      :options="users"
      label="Zugehörige Person"
      filled
    />
  </li>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

defineProps(['list']);

type Task = {
  taskname: string;
  description: string;
  priority: number;
  date?: Date;
  addedUser: string;
};

const task: Ref<Task> = ref({
  taskname: '',
  description: '',
  priority: 0,
  addedUser: '',
});
const users: Array<string> = ['Thien'];
</script>

<style scoped>
.listcontainer {
  max-width: 50vw;
  margin: auto;
  color: white;
  font-size: 200%;
}
</style>
