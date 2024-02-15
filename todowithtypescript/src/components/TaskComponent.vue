<template>
  <div
    v-if="showTask != 100"
    class="taskbox"
    :style="progressStyle"
    @click="drawerRight = !drawerRight"
  >
    <div style="width: 100%">
      <q-btn
        color="#db7093"
        icon="delete"
        flat
        @click.stop
        @click="remove"
        class="float-right"
      ></q-btn>
      <q-btn
        v-if="task.progress == 100"
        color="#db7093"
        icon="check"
        flat
        @click.stop
        @click="confirm = true"
        class="float-right"
      ></q-btn>
      <!-- <q-slider
        v-if="slider"
        v-model="progress"
        :min="0"
        :max="100"
        :step="25"
        color="pink"
        dark
        style="width: 200px"
        :label-value="task.taskname"
        label
      /> -->
      <div v-if="!editMode" style="font-size: 150%">
        {{ task.taskname }}
        <span
          ><q-icon
            :style="hasPriority(task.priority)"
            name="warning"
            style="margin-bottom: 3px"
          ></q-icon
        ></span>
      </div>

      <div>Fälligkeitsdatum: {{ task.datum }}</div>

      <div v-if="!editMode"></div>
      <div>
        <q-chip color="white" v-for="tag of task.tags" :key="tag.tagname"
          >#{{ tag.tagname }}</q-chip
        >
      </div>
    </div>
    <q-dialog v-model="confirm">
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
            @click="task.progress = 75"
          />
          <q-btn
            flat
            label="Ja"
            color="#fff0f5"
            v-close-popup
            @click="confirmProgress"
          />
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
          <q-btn
            @click="drawerRight = !drawerRight"
            icon="close"
            text-color="black"
            flat
          ></q-btn>
        </div>
        <div class="drawerelement">
          <q-input
            v-model="task.taskname"
            filled
            standout
            label="Taskname"
          ></q-input>
        </div>
        <div class="drawerelement">
          <q-input
            type="textarea"
            v-model="task.description"
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
              v-model="task.user"
              :options="users"
              label="Zugehörige Person"
              filled
            />
          </div>
          <div>
            <q-select
              standout
              v-model="task.priority"
              label="Priorität"
              :options="prio"
              filled
            ></q-select>
          </div>
        </div>
        <div class="drawerelement">
          <q-input filled v-model="task.datum" label="Datum">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="task.datum" mask="DD.MM.YYYY">
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
            v-model="task.progress"
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
    </q-drawer>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { Task } from 'src/types/types';
import { computed, toRef } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps(['task']);

const task = toRef<Task>(props.task);
const editMode = ref<boolean>(false);
const confirm = ref<boolean>(false);
const showTask = ref<number>(0);
const users: string[] = ['Thien', 'Daniel', 'Andi'];
const prio: string[] = ['Ja', 'Nein'];
const drawerRight = ref<boolean>(false);

const route = useRoute();

const emits = defineEmits(['delete', 'edit']);

async function confirmProgress() {
  showTask.value = 100;
  await axios.post('/updateprio', { taskname: task.value.taskname });
}

// function borderColor(priority: string): string {
//   let prio: string =
//     {
//       Hoch: 'border: 5px solid red;',
//       Mittel: 'border: 5px solid orange;',
//       Niedrig: 'border: 5px solid green;',
//     }[priority] ?? 'border: 3px solid white;';

//   return prio;
// }

async function remove() {
  await axios.delete(`/task/${task.value.id}`);
  emits('delete');
}

// function showProgress(fortschritt: number): string {
//   console.log(progress.value);
//   let prog: string =

//   return prog;
// }

const progressStyle = computed(() => {
  console.log(task.value.progress);
  return (
    {
      0: 'background: linear-gradient(to right, #fff0f5 0%, #fff0f5 100%);',
      25: 'background: linear-gradient(to right, pink 0%, pink 25%, #fff0f5 25%, #fff0f5 100%);',
      50: 'background: linear-gradient(to right, pink 0%, pink 50%, #fff0f5 50%, #fff0f5 100%);',
      75: 'background: linear-gradient(to right, pink 0%, pink 75%, #fff0f5 75%, #fff0f5 100%);',
      100: 'background: linear-gradient(to right, pink 0%, pink 100%);',
    }[task.value.progress] ?? 'background-color: #fff0f5;'
  );
});

function hasPriority(prio: string): string {
  let prior =
    {
      Ja: 'visibility: visible;',
      Nein: 'visibility: hidden;',
    }[prio] ?? 'visibility:hidden;';

  return prior;
}

async function saveTask() {
  const newTask: Task = {
    id: task.value.id,
    listname: route.params.listname as string,
    taskname: task.value.taskname,
    description: task.value.description,
    user: task.value.user,
    datum: task.value.datum,
    priority: task.value.priority,
    uuid: task.value.uuid,
    progress: task.value.progress,
    tags: [],
  };
  await axios.post('/addtaskinfo', newTask);
  drawerRight.value = false;
}
</script>

<style scoped>
.taskbox {
  margin: auto;
  width: 80%;
  border-radius: 8px;
  margin-top: 15px;
  opacity: 0.9;
  padding: 15px;
}

div {
  margin: 3px;
  color: #db7093;
  font-weight: bold;
  font-size: 100%;
}
</style>
