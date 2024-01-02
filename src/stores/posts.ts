import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Post } from 'src/types';
import { ref } from 'vue';
import localforage from 'localforage';
export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[]>([]);
  const limit = ref(10);

  const loadPosts = async () => {
    const currentCount = posts.value.length;
    limit.value = currentCount + 10;

    try {
      const storedPosts: Post[] = await localforage.getItem('posts');

      if (storedPosts !== null) {
        const val = storedPosts.slice(currentCount, limit.value);

        // Add the new data to the end of the existing array
        posts.value = [...posts.value, ...val];

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
      }
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
        const result = response.data;

        // display the first 10 posts
        posts.value = result.slice(0, limit.value);

        // Store the data locally (offline) in localforage
        localforage.setItem('posts', result);
      }
    } catch (error) {
      console.error('🚀 ~ file: posts.ts:16 ~ loadPosts ~ error:', error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Reset to default the store when logout
  const resetStore = async () => {
    isLoading.value = false;
    posts.value = [];
    limit.value = 10;
    await localforage.clear();
  };

  return {
    isLoading,
    posts,
    loadPosts,
    fetchPosts,
    resetStore,
  };
});
