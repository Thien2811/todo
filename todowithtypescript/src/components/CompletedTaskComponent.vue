<template>
  <div class="taskbox" :style="borderColor(task.priority)">
    <div style="font-size: 150%">{{ task.listname }}</div>
    <div>Aufgabe: {{ task.taskname }}</div>
    <div>Zugehörige Person: {{ task.user }}</div>
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
      Hoch: 'border: 5px solid red;',
      Mittel: 'border: 5px solid orange;',
      Niedrig: 'border: 5px solid green;',
    }[priority] ?? 'border: 3px solid white;';

  return prio;
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
