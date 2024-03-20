<template>
  <div class="listeneintrag" @click="moveToList(list.listname)">
    <div class="inline bg-amber rounded-borders" style="max-width: 300px">
      <div
        v-if="!editMode"
        class="fit flex flex-center text-center non-selectable q-pa-md"
        :style="backgroundStyle"
      >
        {{ list.listname }}
      </div>

      <q-menu touch-position context-menu>
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section @click="removeList(list.uuid)"
              >Liste löschen</q-item-section
            >
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section @click="editListname"
              >Listennamen bearbeiten</q-item-section
            >
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section @click="colorpalette = !colorpalette"
              >Farbe ändern</q-item-section
            >
          </q-item>
        </q-list>
      </q-menu>

      <q-dialog v-model="colorpalette">
        <q-card style="margin: auto">
          <q-card-section>
            <q-color
              v-model="list.hex"
              no-header-tabs
              class="my-picker"
              @change="saveColor"
            ></q-color>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <q-input
      v-if="editMode"
      v-model="list.listname"
      standout
      bg-color="white"
      filled
      label="Neuer Listenname"
      @keyup.enter="editListname"
    ></q-input>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, computed } from 'vue';

import { useRouter } from 'vue-router';

import axios from 'axios';

type List = {
  uuid: string;
  hex: string;
  listname: string;
};

const props = defineProps(['list']);
const list = toRef<List>(props.list);
const emit = defineEmits(['delete']);
const editMode = ref<boolean>(false);
const router = useRouter();
const colorpalette = ref<boolean>(false);

async function saveColor() {
  await axios.post('/color', { uuid: list.value.uuid, hex: list.value.hex });
}

async function removeList(searchValue: string): Promise<void> {
  emit('delete', searchValue);
}

function moveToList(direction: string): string {
  router.push({
    name: 'list',
    params: { listname: direction, uuid: props.list.uuid },
    // query: { listname: direction, uuid: props.list.uuid },
  });
  return direction;
}

async function editListname() {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    await axios.post('/savelistname', {
      id: props.list.uuid,
      listname: props.list.listname,
    });
  }
}

const backgroundStyle = computed(() => {
  return `background-color: ${list.value.hex}`;
});
</script>

<style scoped>
.listeneintrag {
  width: 90%;
  display: block;
  padding: 2px;
  color: black;
  margin: 10px;
  font-weight: bold;
}
</style>
