import 'pinia';
import { defineStore } from 'pinia';
import { useOnline } from '@vueuse/core';
import { computed, ref } from 'vue';
import { usePostStore } from './posts';

export const useSyncState = defineStore('sync', () => {
  const isOnline = computed(() => {
    return useOnline();
  });
  const itemsProgression = ref(0);

  const getItemsLoadingProgression = computed(() => {
    return itemsProgression.value;
  });
  const getItemsLoadingProgressionValue = computed(() => {
    return itemsProgression.value / 100;
  });

  const setLoadingProgression = (value: number) => {
    itemsProgression.value = value;
  };

  const simulateProgression = async () => {
    const { fetchAllUsers } = usePostStore()
    const users = await fetchAllUsers()
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < users.length) {
        index++
        itemsProgression.value = 100;
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  };

  return {
    isOnline,
    getItemsLoadingProgression,
    getItemsLoadingProgressionValue,
    setLoadingProgression,
    simulateProgression,
  };
});
