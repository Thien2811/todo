<template>
  <div
    v-if="showTask != 100"
    class="taskbox"
    :style="taskStyle"
    @click="$emit('edit', task)"
  >
    <div style="width: 100%">
      <!-- <div>
        <q-icon
          v-if="task.priority == 'Ja'"
          name="warning"
          style="margin-bottom: 3px"
          size="200%"
          ><q-tooltip
            style="
              background-color: pink;
              color: black;
              font-size: 120%;
              border: 3px solid red;
            "
            >Zeit zu kochen
            <q-icon name="outdoor_grill"
              ><q-tooltip></q-tooltip></q-icon></q-tooltip
        ></q-icon>
        <q-icon
          v-else
          name="self_improvement"
          style="margin-bottom: 3px"
          size="200%"
          ><q-tooltip
            style="
              background-color: pink;
              color: black;
              font-size: 120%;
              border: 3px solid green;
            "
            >Chill mal <q-icon name="weekend"></q-icon></q-tooltip
        ></q-icon>
      </div> -->
      <div style="font-size: 150%">
        <span class="q-mr-sm"
          >{{ task.taskname }}
          <span v-if="task.description.length > 0">
            <q-btn
              v-if="showDesc == true"
              icon="arrow_drop_down"
              size="60%"
              flat
              style="padding-left: 3px; padding-right: 0"
              @click="showDesc = false"
              @click.stop
            ></q-btn>
            <q-btn
              v-if="showDesc == false"
              icon="arrow_drop_up"
              size="60%"
              flat
              style="padding-left: 3px; padding-right: 0"
              @click="showDesc = true"
              @click.stop
            ></q-btn>
          </span>
          <q-btn
            color="#db7093"
            icon="delete"
            flat
            @click.stop
            @click="remove"
            class="float-right"
          ></q-btn>
          <div v-if="showDesc == false" style="font-size: 60%">
            {{ task.description }}
          </div>
          <q-btn
            v-if="task.progressnumber == 100"
            color="#db7093"
            icon="check"
            flat
            @click.stop
            @click="confirm = true"
            class="float-right"
          ></q-btn>
        </span>
      </div>

      <div>
        Fälligkeitsdatum: {{ task.datum }}
        <q-chip
          color="white"
          size="80%"
          style="border: 1px solid pink"
          v-for="tag of task.tags"
          :key="tag.tagname"
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
          <q-btn flat label="Nein" color="#fff0f5" v-close-popup />
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
  </div>
</template>
<script async setup lang="ts">
import axios from 'axios';
import { Task } from 'src/types/types';
import { computed, toRef } from 'vue';
import { ref } from 'vue';

const props = defineProps(['task']);

const task = toRef<Task>(props.task);
const confirm = ref<boolean>(false);
const showTask = ref<number>(0);
const showDesc = ref<boolean>(true);

const emits = defineEmits(['delete', 'edit']);

async function confirmProgress() {
  showTask.value = 100;
  await axios.post('/updateprio', { taskname: task.value.taskname });
}

async function remove() {
  await axios.delete(`/task/${task.value.id}`);
  emits('delete');
}

const taskStyle = computed(() => {
  let style = {
    0: {
      background: 'linear-gradient(to right, #fff0f5 0%, #fff0f5 100%)',
      'border-left': '',
    },
    25: {
      background:
        'linear-gradient(to right, pink 0%, pink 25%, #fff0f5 25%, #fff0f5 100%)',
      'border-left': '',
    },
    50: {
      background:
        'linear-gradient(to right, pink 0%, pink 50%, #fff0f5 50%, #fff0f5 100%)',
      'border-left': '',
    },
    75: {
      background:
        'linear-gradient(to right, pink 0%, pink 75%, #fff0f5 75%, #fff0f5 100%)',
      'border-left': '',
    },
    100: {
      background: 'linear-gradient(to right, pink 0%, pink 100%)',
      'border-left': '',
    },
  }[task.value.progressnumber] ?? { background: '#fff0f5' };

  const prio =
    {
      Ja: '10px solid red',
    }[task.value.priority] ?? '10px solid pink';

  style['border-left'] = prio;

  return style;
});
</script>

<style scoped>
.taskbox {
  margin: auto;
  width: 40vw;
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
