<template>
  <div class="taskbox" :style="borderColor(task.priority)">
    <div style="font-size: 150%">
      {{ task.taskname.replaceAll(' ', '')
      }}<span style="font-size: 80%" class="q-ml-sm text-pink-3">
        {{ task.listname }}</span
      >
    </div>
    <div v-if="task.user != 'Zugehörige Person'">
      Zugehörige Person: {{ task.user }}
    </div>
    <div>Erledigt am: {{ task.datum }}</div>
  </div>
</template>
<script setup lang="ts">
import { Task } from 'src/types/types';
import { toRef } from 'vue';

const props = defineProps(['task']);

const task = toRef<Task>(props.task);

function borderColor(priority: string): string {
  let prio: string =
    {
      Ja: 'border-left: 10px solid red;',
    }[priority] ?? 'border-left: 10px solid pink';

  return prio;
}
</script>

<style scoped>
.taskbox {
  margin: auto;
  width: 90%;
  padding: 10px;
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
