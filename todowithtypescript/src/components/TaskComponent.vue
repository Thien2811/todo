<template>
  <div class="taskbox" :style="borderColor(priority)">
    <div v-if="!editMode">
      Aufgabe: {{ taskname }}
      <q-btn
        @click="editTask"
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
      <div v-if="editMode">
        <q-input v-model="editTaskname"></q-input>
      </div>
    </div>
    <div>Aufgabenbeschreibung: {{ description }}</div>
    <div>Zugehörige Person: {{ user }}</div>
    <div>Fälligkeitsdatum: {{ date }}</div>
    <div>Priorität: {{ priority }}</div>
    <div>
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
import { watch } from 'vue';
import { ref, toRef } from 'vue';
const props = defineProps([
  'taskname',
  'description',
  'user',
  'date',
  'priority',
]);

const progress = ref<number>();
const editMode = ref<boolean>(false);
const editTaskname = toRef<string>(props.taskname);

const emits = defineEmits(['delete']);

watch(progress, (newProgress) => {
  if (newProgress) console.log(newProgress);
});

function borderColor(priority: string): string {
  let prio: string =
    {
      Hoch: 'border: 3px solid red;',
      Mittel: 'border: 3px solid orange;',
      Niedrig: 'border: 3px solid green;',
    }[priority] ?? 'border: 3px solid white;';

  return prio;
}

function editTask(): boolean {
  editMode.value = !editMode.value;
  return editMode.value;
}

async function remove() {
  await axios.delete(`/task/${props.taskname}`);
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
