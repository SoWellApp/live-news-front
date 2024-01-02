<template>
  <q-page padding>
    <div class="button-container">
      <q-btn
        @click="toggleLoading"
        class="start"
        flat
        icon="play_arrow"
        v-if="!simulation"
      >
      </q-btn>
      <q-btn @click="toggleLoading" class="stop" flat icon="stop" v-else>
      </q-btn>
    </div>
    <template v-if="!isLoading">
      <q-list class="column">
        <q-item v-for="post in posts" :key="post.id">
          <post-card :post="post"></post-card>
        </q-item>
      </q-list>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from 'src/stores/posts';
import PostCard from 'src/components/PostCard.vue';

const postStore = usePostStore();
const { isLoading, posts } = storeToRefs(postStore);
const { loadPosts, simulateNewPost, stopSimulation } = postStore;
const simulation = ref(false);

const handleScroll = () => {
  const container = document.documentElement;
  const scrollHeight = container.scrollHeight;
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;

  // Call the loadPosts when the scroll is in the bottom
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadPosts();
  }
};

const toggleLoading = () => {
  simulation.value = !simulation.value;
  if (simulation.value) {
    simulateNewPost();
  } else {
    stopSimulation();
  }
};

onMounted(() => {
  document.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll);
});
</script>
<style scoped>
.button-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
.q-btn.start {
  background-color: aquamarine;
}
.q-btn.stop {
  background-color: brown;
}
</style>
