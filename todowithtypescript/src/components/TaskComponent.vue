<template>
  <div
    v-if="progress != 100"
    class="taskbox"
    :style="borderColor(task.priority)"
    @click="openDrawer"
  >
    <q-btn
      color="#db7093"
      icon="delete"
      flat
      @click="remove"
      class="float-right"
    ></q-btn>

    <div v-if="!editMode">Aufgabe: {{ task.taskname }}</div>

    <div>Fälligkeitsdatum: {{ task.datum }}</div>

    <div v-if="!editMode">
      Fortschritt: {{ progress }}%
      <q-slider
        v-model="progress"
        :min="0"
        :max="100"
        :step="25"
        color="pink"
        dark
      />
    </div>
    <div>
      <q-chip color="white" v-for="tag of task.tags" :key="tag"
        >#{{ tag.tagname }}</q-chip
      >
    </div>
  </div>
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm" style="color: black"
          >Dein Fortschritt ist auf 100%. Möchtest du deine Task
          abschließen?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Nein"
          color="#fff0f5"
          v-close-popup
          @click="progress = 75"
        />
        <q-btn
          flat
          label="Ja"
          color="#fff0f5"
          v-close-popup
          @click="confirmProgress"
        /> </q-card-actions
      >db7093
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import { Task } from 'src/types/types';
import { toRef } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps(['task']);

const task = toRef<Task>(props.task);
const progress = ref<number>();
const editMode = ref<boolean>(false);
const confirm = ref<boolean>(false);

const emits = defineEmits(['delete', 'edit', 'opendrawer']);

watch(progress, async (newProgress) => {
  console.log(newProgress);
  console.log(props.task.tags);
  if (newProgress == 100) {
    confirm.value = true;
  }
});

async function confirmProgress() {
  await axios.post('/updateprio', { taskname: task.value.taskname });
}

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
        tags,
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
        tags,
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

function openDrawer() {
  emits('opendrawer');
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
