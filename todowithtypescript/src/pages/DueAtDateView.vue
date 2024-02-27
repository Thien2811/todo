<template>
  <div class="q-pa-lg" style="margin-left: 220px">
    <q-timeline color="pink-4">
      <q-timeline-entry heading> Tasks der nächsten 7 Tage </q-timeline-entry>

      <q-timeline-entry
        v-for="task of sortedTasks"
        :key="task.id"
        :subtitle="task.datum"
        style="color: white; font-size: 150%"
      >
        <span style="font-weight: bold">{{ task.listname }}:</span>
        {{ task.taskname }}
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
import { Task } from 'src/types/types';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { DateTime } from 'luxon';

const tasks = ref<Task[]>([]);
const dateNow = new Date().getTime();
console.log(dateNow);
const sevenDays = 604800000;
const inAWeek = new Date(dateNow + sevenDays).toLocaleDateString();
console.log(inAWeek);

onMounted(async () => {
  const res = await axios.get('/getalltasks');

  for (let task of res.data) {
    if (task.progress != 'DONE') {
      if (new Date(task.datum).getTime() < new Date(inAWeek).getTime()) {
        task.datum = new Date(task.datum).toLocaleString('de').split(',')[0];
        tasks.value.push(task);
      }
    }
  }
});

const sortedTasks = computed(() => {
  const unsortedTasks = tasks.value;
  return unsortedTasks.sort(
    (taskA: Task, taskB: Task) =>
      DateTime.fromFormat(taskA.datum, 'dd.MM.yyyy').toMillis() -
      DateTime.fromFormat(taskB.datum, 'dd.MM.yyyy').toMillis()
  );
});
</script>

<style scoped></style>
