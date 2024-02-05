<template>
  <h1>{{ router.query.listname }}</h1>
  <div>
    <q-btn label="Task hinzufügen" color="primary" @click="prompt = true" />
    <q-dialog v-model="prompt" persistent>
      <q-card
        style="
          width: 1300px;
          max-width: 70vw;
          height: 470px;
          background-color: dodgerblue;
        "
      >
        <q-card-section>
          <div class="text-h5">Task hinzufügen</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div style="display: inline-flex">
            <q-input
              style="width: 380px"
              class="input"
              bg-color="white"
              standout
              filled
              v-model="taskname"
              label="Aufgabe"
            ></q-input>
            <q-select
              style="width: 265px; position: absolute; left: 418px"
              class="input"
              standout
              bg-color="white"
              v-model="taggedUser"
              :options="users"
              label="Zugehörige Person"
              filled
            />
            <q-select
              style="width: 265px; position: absolute; left: 703px"
              standout
              bg-color="white"
              v-model="priority"
              label="Priorität"
              :options="prio"
              filled
            ></q-select>
          </div>
          <div>
            <q-input
              input-style="min-height: 198px"
              style="width: 953px"
              type="textarea"
              bg-color="white"
              standout
              filled
              v-model="description"
              label="Aufgabenbeschreibung"
            ></q-input>
          </div>
          <div style="display: block">
            <q-date
              style="position: absolute; right: 20px; top: 1px"
              v-model="date"
              minimal
              mask="DD.MM.YYYY"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            style="position: absolute; right: 125px; top: 420px"
            flat
            text-color="black"
            label="Abbrechen"
            v-close-popup
          />
          <q-btn
            style="position: absolute; right: 17px; top: 420px"
            flat
            text-color="black"
            color="white"
            label="Bestätigen"
            @click="addNewTask"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn-dropdown
      color="primary"
      label="Sortieren"
      style="position: absolute; right: 10px"
    >
      <q-list>
        <q-item clickable @click="orderBy('prio')" v-close-popup>
          <q-item-section>
            <q-item-label>Priorität</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="orderBy('date')" v-close-popup>
          <q-item-section>
            <q-item-label>Datum</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="orderBy('alpha')" v-close-popup>
          <q-item-section>
            <q-item-label>Alphabetisch</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div>
    <TaskComponent
      v-for="task of tasks"
      :key="task.id"
      :task="task"
      @delete="remove(task)"
    ></TaskComponent>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import TaskComponent from 'src/components/TaskComponent.vue';
import axios from 'axios';
import { Task } from 'src/types/types';

const router = useRoute();
const url: string = router.query.listname?.toString() ?? '';
const uuid: string = router.query.uuid?.toString() ?? '';

onMounted(async () => {
  const res = await axios.post('/gettasks', { url });
  res.data.forEach((el: Task): void => {
    tasks.value.push(el);
  });
});

const prompt = ref(false);
const tasks = ref<Task[]>([]);
const taskname: Ref<string> = ref('');
const description: Ref<string> = ref('');
const taggedUser: Ref<string> = ref('Zugehörige Person');
const users: string[] = ['Thien', 'Daniel', 'Andi'];
const date = ref<string>('');
const priority: Ref<string> = ref('Priorität');
const prio: string[] = ['Hoch', 'Mittel', 'Niedrig'];

async function addNewTask(): Promise<void> {
  const task: Task = {
    id: 0,
    listname: url,
    taskname: taskname.value,
    description: description.value,
    user: taggedUser.value,
    date: date.value,
    priority: priority.value,
    uuid: uuid,
  };
  const res = await axios.post('/addtask', { task });
  task.id = res.data.insertId;
  tasks.value.push(task);
}

function orderBy(by: string) {
  console.log(by);
  tasks.value =
    {
      prio: tasks.value.sort(
        (a: Task, b: Task) => getPrio(b.priority) - getPrio(a.priority)
      ),
      date: tasks.value.sort(
        (a: Task, b: Task) =>
          +new Date(a.date?.split('.').reverse().join('-')) -
          +new Date(b.date?.split('.').reverse().join('-'))
      ),
      alpha: tasks.value.sort((a: Task, b: Task) =>
        a.taskname.localeCompare(b.taskname)
      ),
    }[by] ??
    tasks.value.sort((a: Task, b: Task) =>
      a.taskname.localeCompare(b.taskname)
    );

  console.log(tasks.value);
}

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

<style scoped>
h1 {
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 1000%;
}

div {
  margin-top: 10px;
}

.text-h5 {
  font-weight: bold;
}
</style>
