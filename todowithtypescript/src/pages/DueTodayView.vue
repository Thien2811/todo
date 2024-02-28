<template>
  <div class="q-pa-lg" style="margin-left: 220px">
    <q-timeline>
      <q-timeline-entry heading>
        Heutiges Datum: {{ new Date().toLocaleString('de').split(',')[0] }}
      </q-timeline-entry>
    </q-timeline>
    <div>
      <DueDatesComponent
        v-for="task of tasks"
        :key="task.id"
        :task="task"
        @delete="remove(task)"
      ></DueDatesComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DueDatesComponent from 'src/components/DueDatesComponent.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { Task } from 'src/types/types';

onMounted(async () => {
  const date = new Date().toISOString().substring(0, 10);

  const res = await axios.post('/getduetasks', { currentDate: date });

  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].progress == null) {
      res.data[i].datum = dayjs(res.data[i].datum).format('DD.MM.YYYY');
      console.log(res.data[i], i);
      tasks.value.push(res.data[i]);
      tasks.value = tasks.value.sort(
        (a: Task, b: Task) => getPrio(b.priority) - getPrio(a.priority)
      );
    }
  }
});

const tasks = ref<Task[]>([]);

function getPrio(priority: string): number {
  let prio: number =
    {
      Hoch: 3,
      Mittel: 2,
      Niedrig: 1,
    }[priority] ?? 0;

  return prio;
}

function remove(task: Task): void {
  const index = tasks.value.findIndex((el) => el.id === task.id);
  tasks.value.splice(index, 1);
}
</script>

<style scoped></style>
