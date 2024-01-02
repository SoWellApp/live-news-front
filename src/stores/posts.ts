import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Post } from 'src/types';
import { ref } from 'vue';

export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[]>([]);

  const loadPosts = async () => {
    try {
      // wait until all the avatars are loaded before displaying the data
      await Promise.all(
        posts.value.map(async (post) => {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = post.author.avatar;
          });
        })
      );
    } catch (error) {
      console.error('Error loading posts:', error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Separation of the API to be able to handle it better and have more visibility
  const fetchPosts = async () => {
    isLoading.value = true;
    try {
      const response = await api.get<Post[]>('/posts/find?sort=updatedAt DESC');

      if (response.status === 200) {
        posts.value = response.data;
      }
    } catch (error) {
      console.error('🚀 ~ file: posts.ts:16 ~ loadPosts ~ error:', error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    posts,
    loadPosts,
    fetchPosts,
  };
});
