<template>
  <div class="text-h1 text-center" style="color: white; font-weight: bold">
    {{ router.params.listname }}
  </div>
  <div>
    <q-btn
      style="
        background-color: #db7093;
        color: white;
        opacity: 0.9;
        margin-left: 20px;
      "
      @click="drawerRight = !drawerRight"
      label="Task hinzufügen"
    />
    <q-btn-dropdown
      flat
      class="float-right"
      label="Sortieren"
      style="
        background-color: #db7093;
        color: white;
        opacity: 0.9;
        margin-right: 20px;
      "
    >
      <q-list>
        <q-item clickable @click="orderBy(0)" v-close-popup>
          <q-item-section>
            <q-item-label>Priorität</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="orderBy(1)" v-close-popup>
          <q-item-section>
            <q-item-label>Datum</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="orderBy(2)" v-close-popup>
          <q-item-section>
            <q-item-label>Alphabetisch</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-drawer
      side="right"
      v-model="drawerRight"
      :width="400"
      :breakpoint="500"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <div
        class="bg-pink-1"
        style="display: flex; flex-direction: column; height: 100%"
      >
        <div style="display: flex; justify-content: right; margin-top: 20px">
          <q-btn
            @click="drawerRight = !drawerRight"
            icon="close"
            text-color="black"
            flat
          ></q-btn>
        </div>
        <div class="drawerelement">
          <q-input
            v-model="taskname"
            filled
            standout
            label="Taskname"
          ></q-input>
        </div>
        <div class="drawerelement">
          <q-input
            type="textarea"
            v-model="description"
            standout
            filled
            label="Beschreibung"
          ></q-input>
        </div>
        <div class="drawerelement">
          <div>
            <q-select
              class="input"
              standout
              v-model="taggedUser"
              :options="users"
              label="Zugehörige Person"
              filled
            />
          </div>
          <div>
            <q-select
              standout
              v-model="priority"
              label="Priorität"
              :options="prio"
              filled
            ></q-select>
          </div>
        </div>
        <div class="drawerelement">
          <q-input
            filled
            v-model="date"
            mask="date"
            :rules="['date']"
            label="Datum"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="drawerelement"
          style="display: flex; justify-content: center"
        >
          <q-btn
            flat
            text-color="black"
            color="white"
            label="Bestätigen"
            @click="addNewTask"
          />
        </div>
      </div>
    </q-drawer>
  </div>

  <div class="scrollable">
    <TaskComponent
      v-for="task of tasks"
      :key="task.id"
      :task="task"
      @delete="remove(task)"
    ></TaskComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TaskComponent from 'src/components/TaskComponent.vue';
import axios from 'axios';
import { Task } from 'src/types/types';

const router = useRoute();
const uuid: string = router.params.uuid?.toString() ?? '';

watch(useRouter().currentRoute, async () => {
  tasks.value = [];
  const url = router.params.listname ?? '';
  const res = await axios.post('/gettasks', {
    url,
  });
  res.data.forEach((el: Task): void => {
    el.datum = new Date(el.datum).toLocaleDateString('de');
    tasks.value.push(el);
  });
});

const drawerRight = ref<boolean>(false);
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
    listname: router.params.listname as string,
    taskname: taskname.value,
    description: description.value,
    user: taggedUser.value,
    datum: date.value.split('/').reverse().join(),
    priority: priority.value,
    uuid: uuid,
  };
  const res = await axios.post('/addtask', { task });
  task.id = res.data.insertId;
  tasks.value.push(task);
}

function orderBy(by: number) {
  if (by === 0) {
    console.log('sort by prio');
    tasks.value = tasks.value.sort(
      (a: Task, b: Task) => getPrio(b.priority) - getPrio(a.priority)
    );
  } else if (by === 1) {
    console.log('sort by date');
    tasks.value = tasks.value.sort(
      (a: Task, b: Task) =>
        +new Date(a.datum?.split('.').reverse().join('-')) -
        +new Date(b.datum?.split('.').reverse().join('-'))
    );
  } else {
    console.log('sort by name');
    tasks.value = tasks.value.sort((a: Task, b: Task) =>
      a.taskname.localeCompare(b.taskname)
    );
  }
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
}

.text-h5 {
  font-weight: bold;
}

.scrollable {
  max-height: 870px;
  overflow: auto;
}

.drawerelement {
  margin: 10px;
  width: 95%;
}
</style>
