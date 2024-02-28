<template>
  <div
    style="
      backdrop-filter: blur(20px);
      width: 50%;
      margin: auto;
      padding-bottom: 50px;
      border-radius: 10px;
    "
  >
    <div class="q-pa-lg text-center">
      <div>
        <q-timeline>
          <q-timeline-entry heading style="color: white">
            Abgeschlossene Tasks der letzten 14 Tage</q-timeline-entry
          >
        </q-timeline>
      </div>
    </div>
    <div>
      <CompletedTaskComponent
        v-for="task of tasks"
        :key="task.id"
        :task="task"
      ></CompletedTaskComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CompletedTaskComponent from 'src/components/CompletedTaskComponent.vue';
import axios from 'axios';
import { Task } from 'src/types/types';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';

const tasks = ref<Task[]>([]);

onMounted(async () => {
  //14 tage in millisekunden
  const daysInMilliseconds = 1000 * 60 * 60 * 24 * 14;
  const currentDate = new Date().getTime();
  const res = await axios.get('/finishedtasks');

  for (const task of res.data as Task[]) {
    const finishedDate = new Date(task.datum).getTime();
    if (currentDate - finishedDate >= daysInMilliseconds) {
      await axios.post('/archivetask', { id: task.id });
    } else {
      task.datum = new Date(task.datum).toLocaleDateString('de');
      tasks.value.push(task);
    }
  }
});
</script>

<style scoped></style>
