<template>
  <div style="display: flex; justify-content: center">
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
          <q-btn-dropdown icon="more" flat>
            <q-list v-for="(index, i) of listnames" :key="index">
              <q-item clickable v-close-popup @click="changeList(listnames[i])">
                <q-item-section>
                  <q-item-label>{{ listnames[i] }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            @click="drawerRight = !drawerRight"
            icon="close"
            text-color="black"
            flat
          ></q-btn>
        </div>
        <div class="drawerelement">
          <q-input
            v-model="editTask.taskname"
            filled
            standout
            label="Taskname"
          ></q-input>
        </div>
        <div class="drawerelement">
          <q-input
            type="textarea"
            v-model="editTask.description"
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
              v-model="editTask.user"
              :options="users"
              label="Zugehörige Person"
              filled
            />
          </div>
          <div class="q-mt-md">
            <q-select
              class="input"
              standout
              v-model="editTask.priority"
              label="Priorität"
              :options="prio"
              filled
            ></q-select>
          </div>
        </div>
        <div class="drawerelement">
          <q-input filled v-model="editTask.datum" label="Datum">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="editTask.datum" mask="DD.MM.YYYY">
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
            v-model="editTask.progressnumber"
            :min="0"
            :max="100"
            :step="25"
            color="pink"
            dark
            track-color="pink-3"
            label-value="Fortschritt"
            label
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
    </q-drawer>
  </div>

  <div style="margin: auto; width: 40vw; overflow: auto; padding-bottom: 10px">
    <div class="q-mt-lg" style="font-size: 400%; color: black">
      {{ route.params.listname }}
      <span class="text-h4">{{ getTaskAmount }}/{{ taskCount }}</span>
    </div>
    <span style="color: white; font-weight: bold">
      <q-btn
        style="background-color: #db7093; color: white; opacity: 0.9"
        @click="prompt = !prompt"
        icon="add"
        flat
      />
      <q-btn-dropdown
        flat
        icon="sort"
        style="
          background-color: #db7093;
          color: white;
          opacity: 0.9;
          margin-left: 15px;
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
    </span>
  </div>

  <div class="scrollable">
    <TaskComponent
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @delete="remove(task)"
      @edit="edit($event)"
    ></TaskComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, toRef, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TaskComponent from 'src/components/TaskComponent.vue';
import axios from 'axios';
import { Task } from 'src/types/types';
import dayjs from 'dayjs';
import parsePlugin from 'dayjs-parser';

dayjs.extend(parsePlugin);
dayjs.locale('de');

const route = useRoute();
const uuid: string = route.params.uuid?.toString() ?? '';
const tasks = ref<Task[]>([]);
const taskname: Ref<string> = ref('');
const description: Ref<string> = ref('');
const taggedUser: Ref<string> = ref('Zugehörige Person');
const date = ref<string>('');
const priority: Ref<string> = ref('Priorität');
const prompt = ref<boolean>(false);
const taskCount = ref<number>();
const listnames = ref<string[]>([]);

const users: string[] = ['Thien', 'Daniel', 'Andi'];
const prio: string[] = ['Ja', 'Nein'];
const drawerRight = ref<boolean>(false);
let editTask = ref<Task>({
  id: 0,
  listname: '',
  datum: '',
  description: '',
  priority: '',
  progress: 0,
  tags: [],
  taskname: '',
  user: '',
  uuid: '',
  progressnumber: 0,
});

function edit(newEditTask: Task): void {
  drawerRight.value = !drawerRight.value;
  editTask = toRef(newEditTask);
}

async function saveTask() {
  const newTask: Task = {
    id: editTask.value.id,
    listname: route.params.listname as string,
    taskname: editTask.value.taskname,
    description: editTask.value.description,
    user: editTask.value.user,
    datum: editTask.value.datum,
    priority: editTask.value.priority,
    uuid: editTask.value.uuid,
    progress: editTask.value.progress,
    tags: [],
    progressnumber: editTask.value.progressnumber,
  };
  await axios.post('/addtaskinfo', newTask);
  drawerRight.value = false;
}

onMounted(async () => {
  loadTask();
  const listname = await axios.get('/getlistnames');
  for (let list of listname.data) {
    if (list.listname != route.params.listname)
      listnames.value.push(list.listname);
  }
});

watch(useRouter().currentRoute, async () => {
  tasks.value = [];
  listnames.value = [];
  loadTask();
  const listname = await axios.get('/getlistnames');
  for (let list of listname.data) {
    if (list.listname != route.params.listname)
      listnames.value.push(list.listname);
  }
});

const getTaskAmount = computed(() => tasks.value.length);

async function loadTask() {
  const url = route.params.listname ?? '';
  const res = await axios.post('/gettasks', {
    url,
  });
  taskCount.value = res.data.length;
  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].progress != 'DONE') {
      res.data[i].datum = new Date(res.data[i].datum).toLocaleDateString('de');
      const tags = await axios.get(`/tags/${res.data[i].id}`);
      res.data[i].tags = tags.data;
      tasks.value.push(res.data[i]);
    }
  }
}

async function addNewTask(): Promise<void> {
  const dateString = taskname.value.split('@')[1];
  const name = taskname.value.split('#')[0];
  const tags = taskname.value.split('@')[0].split('#').toSpliced(0, 1);

  const createTimeFromString = dayjs(dateString);
  const finalDate = new Date(createTimeFromString.$d);
  date.value = finalDate.toISOString().substring(0, 10);

  const task: Task = {
    id: 0,
    listname: route.params.listname as string,
    taskname: name,
    description: description.value,
    user: taggedUser.value,
    datum: date.value.split('-').reverse().join('.'),
    priority: priority.value,
    uuid: uuid,
    tags: [],
    progress: 0,
    progressnumber: 0,
  };

  for (const tag of tags) {
    task.tags.push({ tagname: tag });
  }

  const res = await axios.post('/addtask', { task });
  task.id = res.data.insertId;

  tasks.value.push(task);
  taskCount.value++;
}

function orderBy(by: number) {
  if (by === 0) {
    tasks.value = tasks.value.sort(
      (a: Task, b: Task) => getPrio(b.priority) - getPrio(a.priority)
    );
  } else if (by === 1) {
    tasks.value = tasks.value.sort(
      (a: Task, b: Task) =>
        +new Date(a.datum?.split('.').reverse().join('-')) -
        +new Date(b.datum?.split('.').reverse().join('-'))
    );
  } else {
    tasks.value = tasks.value.sort((a: Task, b: Task) =>
      a.taskname.localeCompare(b.taskname)
    );
  }
}

function getPrio(priority: string): number {
  let prio: number =
    {
      Ja: 1,
    }[priority] ?? 0;

  return prio;
}

function remove(task: Task): void {
  const index = tasks.value.findIndex((el) => el.id === task.id);
  tasks.value.splice(index, 1);
  taskCount.value--;
}

async function changeList(list: string): Promise<void> {
  await axios.post('/changelist', {
    listname: list,
    taskname: editTask.value.taskname,
  });
  const i = tasks.value.findIndex((el) => {
    return el.taskname == editTask.value.taskname;
  });
  tasks.value.splice(i, 1);
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
  margin: auto;
  width: 40vw;
  max-height: 82vh;
  overflow: auto;
}

.drawerelement {
  margin: 10px;
  width: 95%;
}
</style>
