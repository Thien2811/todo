<template>
  <div class="taskbox" :style="borderColor(task.priority)">
    <q-btn
      color="#db7093"
      icon="delete"
      flat
      @click="remove"
      class="float-right"
    ></q-btn>
    <q-btn
      @click="editTask()"
      color="#db7093"
      icon="edit"
      flat
      class="float-right"
    ></q-btn>
    <div v-if="!editMode" style="font-size: 150%">{{ task.listname }}</div>
    <div v-if="editMode">
      <q-input
        dense
        v-model="task.listname"
        bg-color="white"
        standout
        filled
        label="Listenname"
      ></q-input>
    </div>
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

    <div>Zugehörige Person: {{ task.user }}</div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { Task } from 'src/types/types';
import { toRef } from 'vue';
import { ref } from 'vue';
const props = defineProps(['task']);

const task = toRef<Task>(props.task);
const editMode = ref<boolean>(false);

const emits = defineEmits(['delete', 'edit']);

function borderColor(priority: string): string {
  let prio: string =
    {
      Hoch: 'border: 5px solid red;',
      Mittel: 'border: 5px solid orange;',
      Niedrig: 'border: 5px solid green;',
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
        datum,
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
        datum,
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
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  background-color: #fff0f5;
  opacity: 0.9;
}

div {
  margin: 5px;
  color: #db7093;
  font-weight: bold;
}
</style>
