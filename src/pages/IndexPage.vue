<template>
  <q-page padding>
    <template v-if="isLoading"> Loading... </template>
    <template v-else>
      <q-list class="column">
        <q-item v-for="post in posts" :key="post.id">
          <post-card :post="post"></post-card>
        </q-item>
        <q-inner-loading :showing="isLoadingMore" label="Loading posts.." label-class="text-teal"
          label-style="font-size: 1.1em" />
      </q-list>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from 'src/stores/posts';
import PostCard from 'src/components/PostCard.vue';
import { debounce } from 'lodash';

const postStore = usePostStore();
const { isLoading, isLoadingMore, posts, pagination } = storeToRefs(postStore);
const { loadPosts } = postStore;

onMounted(() => {
  loadPosts();
  const masonry = document.querySelector('.q-list')
  if (masonry) {
    window.addEventListener('scroll', debounce(() => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5 && isLoadingMore) {
        loadPosts(pagination.value?.offset + 1, 10) // 10 by 10 posts
      }
    }, 300));
  }
});


</script>
