<template>
  <div class="q-pa-sm row justify-center">
    <div>
      <div class="col-8 col-sm-6 col-xs-11 q-mt-lg q-mb-lg">
        <div class="row items-center justify-between">
          <sw-toolbar cyname="header" :username="currentUser">
            <template #online>
              <online-check class="q-ml-sm"></online-check>
            </template>
          </sw-toolbar>
        </div>
      </div>
      <div class="column justify-center">
        <div class="h5 q-mb-lg row items-center justify-center">Loading...</div>
        <q-linear-progress class="q-mb-lg" size="24px" rounded :value="itemsLoadingProgressionValue" color="primary">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="primary" :label="`${itemsLoadingProgression}%`" />
          </div>
        </q-linear-progress>
        <div class="h5 row no-wrap items-center justify-center">
          <div>
            Make sure you have good network quality while loading the app data
          </div>
        </div>
        <div class="row q-mt-md justify-center">
          <q-btn :label="'Cancel'" icon="cancel" color="primary" @click="cancelSync"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import SwToolbar from 'src/components/SWToolbar.vue';
import { useSyncState } from 'src/stores/sync';
import { SessionStorage } from 'quasar';
import { useRouter } from 'vue-router';
import OnlineCheck from 'src/components/OnlineCheck.vue';
import { useSessionStore } from 'src/stores/session';

const syncState = useSyncState();
const $router = useRouter();
const { user, resetSession } = useSessionStore()

const currentUser = computed(
  () => user.pseudo
);
const itemsLoadingProgression = computed(
  () => syncState.getItemsLoadingProgression
);
const itemsLoadingProgressionValue = computed(
  () => syncState.getItemsLoadingProgressionValue
);

const cancelSync = async () => {
  resetSession()
  await $router.push('/')
};

watch(itemsLoadingProgression, async () => {
  if (itemsLoadingProgression.value == 100) {
    setTimeout(async () => { // to wait a little bit before switching page
      await $router.push('/');
      syncState.setLoadingProgression(0);

    }, 300)
  }
});
onMounted(() => {
  syncState.simulateProgression();
});
</script>
