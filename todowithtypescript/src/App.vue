<template>
  <div style="background-color: #101010">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header
        elevated
        :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'"
      >
        <q-toolbar>
          <q-toolbar-title>ToDo-Liste</q-toolbar-title>
          <q-btn-dropdown color="primary" icon="person">
            <q-list>
              <q-item
                clickable
                v-close-popup
                text-color="black"
                filled
                v-if="!loginstatus"
              ></q-item>

              <q-item
                clickable
                v-close-popup
                @click="changeLoginStatus"
                v-if="loginstatus"
              >
                <q-item-section>
                  <q-item-label>Einloggen</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup v-if="!loginstatus">
                <q-item-section>
                  <q-item-label>Ausloggen</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>

      <q-drawer
        :v-model="true"
        show-if-above
        :width="75"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-slategrey'"
        style="color: #101010; background: #101010"
      >
        <div class="button">
          <q-btn
            size="150%"
            standout
            color="primary"
            @click="moveToAllLists"
            icon="format_list_numbered"
          />
        </div>
      </q-drawer>

      <q-page-container>
        <q-page>
          <RouterView />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
//TODO
//Listenansicht
//zur jeweiligen lsite weiterleiten
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const loginstatus = ref(true);

function moveToAllLists(): void {
  router.push('/');
}

function changeLoginStatus(): boolean {
  loginstatus.value = false;
  return loginstatus.value;
}
</script>
