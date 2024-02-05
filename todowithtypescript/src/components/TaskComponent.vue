<template>
  <div class="taskbox" :style="borderColor(task.priority)">
    <q-btn
      @click="editTask()"
      color="white"
      icon="edit"
      flat
      style="position: absolute; right: 600px"
    ></q-btn>
    <q-btn
      color="white"
      icon="delete"
      flat
      style="position: absolute; right: 550px"
      @click="remove"
    ></q-btn>
    <div v-if="!editMode">Aufgabe: {{ task.taskname }}</div>
    <div v-if="editMode">
      <q-input
        dense
        v-model="task.taskname"
        bg-color="white"
        standout
        filled
        label="Taskname"
        style="width: 500px"
      ></q-input>
    </div>
    <div v-if="!editMode">Aufgabenbeschreibung: {{ task.description }}</div>
    <div v-if="editMode">
      <q-input
        dense
        v-model="task.description"
        bg-color="white"
        standout
        filled
        label="Aufgabenbeschreibung"
        style="width: 500px"
      ></q-input>
    </div>
    <div>Zugehörige Person: {{ task.user }}</div>
    <div>Fälligkeitsdatum: {{ task.date }}</div>
    <div>Priorität: {{ task.priority }}</div>
    <div v-if="!editMode">
      <q-slider
        v-model="progress"
        :min="0"
        :max="100"
        :step="25"
        color="primary"
        dark
      />Fortschritt: {{ progress }}%
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { Task } from 'src/types/types';
import { toRef } from 'vue';
import { ref } from 'vue';
const props = defineProps(['task']);

const task = toRef<Task>(props.task);
const progress = ref<number>();
const editMode = ref<boolean>(false);

const emits = defineEmits(['delete', 'edit']);

function borderColor(priority: string): string {
  let prio: string =
    {
      Hoch: 'border: 3px solid red;',
      Mittel: 'border: 3px solid orange;',
      Niedrig: 'border: 3px solid green;',
    }[priority] ?? 'border: 3px solid white;';

  return prio;
}

async function editTask(): Promise<void> {
  return new Promise(async (resolve) => {
    editMode.value = !editMode.value;
    if (!editMode.value) {
      const {
        id,
        priority,
        date,
        user,
        description,
        listname,
        taskname,
        uuid,
      } = task.value;
      const t: Task = {
        id,
        taskname,
        listname,
        description,
        user,
        date,
        priority,
        uuid,
      };
      await axios.post('/save', { task: t });
      resolve();
    }
  });
}

async function remove() {
  await axios.delete(`/task/${task.value.id}`);
  emits('delete');
}
</script>

<style scoped>
.taskbox {
  margin: auto;
  width: 50%;
  height: 270px;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  background-color: black;
}

div {
  margin: 5px;
  color: white;
  font-weight: bold;
}
</style>
