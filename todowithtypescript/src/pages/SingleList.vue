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
      @click="prompt = !prompt"
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

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Taskname (ggf. #Tags, @Datum)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="taskname"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn flat label="Bestätigen" v-close-popup @click="addNewTask()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-drawer
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
            v-model="focusTask.taskname"
            filled
            standout
            label="Taskname"
          ></q-input>
        </div>
        <div class="drawerelement">
          <q-input
            type="textarea"
            v-model="focusTask.description"
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
              v-model="focusTask.user"
              :options="users"
              label="Zugehörige Person"
              filled
            />
          </div>
          <div>
            <q-select
              standout
              v-model="focusTask.priority"
              label="Priorität"
              :options="prio"
              filled
            ></q-select>
          </div>
        </div>
        <div class="drawerelement">
          <q-input filled v-model="focusTask.datum" label="Datum">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="focusTask.datum" mask="DD.MM.YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div>
          <q-slider
            style="padding-left: 40px; padding-right: 40px; margin-top: 10px"
            v-model="progress"
            :min="0"
            :max="100"
            :step="25"
            color="pink"
            dark
            track-color="pink-3"
          />
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
            @click="saveTask"
          />
        </div>
      </div>
    </q-drawer> -->
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
import { ref, Ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TaskComponent from 'src/components/TaskComponent.vue';
import axios from 'axios';
import { Task } from 'src/types/types';
import dayjs from 'dayjs';
import parsePlugin from 'dayjs-parser';

dayjs.extend(parsePlugin);
dayjs.locale('de');

const router = useRoute();
const uuid: string = router.params.uuid?.toString() ?? '';
const tasks = ref<Task[]>([]);
const taskname: Ref<string> = ref('');
const description: Ref<string> = ref('');
const taggedUser: Ref<string> = ref('Zugehörige Person');
const date = ref<string>('');
const priority: Ref<string> = ref('Priorität');
const prompt = ref<boolean>(false);

onMounted(async () => {
  loadTask();
});

watch(useRouter().currentRoute, async () => {
  tasks.value = [];
  loadTask();
});

async function loadTask() {
  const url = router.params.listname ?? '';
  const res = await axios.post('/gettasks', {
    url,
  });

  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].progress != 'DONE') {
      res.data[i].datum = new Date(res.data[i].datum).toLocaleDateString('de');
      const tags = await axios.get(`/tags/${res.data[i].id}`);
      res.data[i].tags = tags.data;
      tasks.value.push(res.data[i]);
      // focusTask.value.description = tasks.value[i].description;
      // focusTask.value.taskname = tasks.value[i].taskname;
      // focusTask.value.user = tasks.value[i].user;
      // focusTask.value.priority = tasks.value[i].priority;
      // focusTask.value.datum = tasks.value[i].datum;
    }
  }

  console.log(tasks.value);
}

//

async function addNewTask(): Promise<void> {
  // const components = taskname.value.split('#');
  // console.log(components);
  // const shownTaskname = components[0];
  // const lastElement = components[components.length - 1];
  // console.log(lastElement);
  // const time = lastElement.split('@')[1];
  // const createTimeFromString = dayjs(time);
  // const finalDate = new Date(createTimeFromString.$d);
  // console.log('stringauslesung', finalDate);
  // date.value = finalDate.toISOString().substring(0, 10);
  // const allTags = [];
  // for (let i = 1; i < components.length - 1; i++) {
  //   allTags.push({ tagname: components[i] });
  // }
  // allTags.push({ tagname: lastElement.split('@')[0] });

  const dateString = taskname.value.split('@')[1];
  const name = taskname.value.split('#')[0];
  const tags = taskname.value.split('@')[0].split('#').toSpliced(0, 1);

  const createTimeFromString = dayjs(dateString);
  const finalDate = new Date(createTimeFromString.$d);
  date.value = finalDate.toISOString().substring(0, 10);

  const task: Task = {
    id: 0,
    listname: router.params.listname as string,
    taskname: name,
    description: description.value,
    user: taggedUser.value,
    datum: date.value.split('-').reverse().join('.'),
    priority: priority.value,
    uuid: uuid,
    tags: [],
    progress: 0,
  };

  for (const tag of tags) {
    task.tags.push({ tagname: tag });
  }

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
