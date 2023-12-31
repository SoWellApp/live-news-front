import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ApiPostResponse, ApiUsersResponse, Post, User } from 'src/types';
import { ref } from 'vue';
import { useSessionStore } from './session';
import preloadImage from 'src/utils/preloadImage';

export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[]>([]);
  const post_users = ref<User[]>([])

  const loadPosts = async () => {
    isLoading.value = true;
    posts.value = [];
    const { user } = useSessionStore()
    try {
      const response = await api.get<ApiPostResponse>('https://api.slingacademy.com/v1/sample-data/blog-posts?limit=10');
      if (response.status === 200) {
        posts.value = response.data?.blogs.map((item) => {
          item.author = post_users.value.find((user) => user.id === item.user_id) || null
          return item
        });
      }
    } catch (error) {
      console.error('🚀 ~ file: posts.ts:16 ~ loadPosts ~ error:', error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get<ApiUsersResponse>('https://api.slingacademy.com/v1/sample-data/users?limit=50');
      if (response.status === 200 && response.data?.users) {
        post_users.value = response.data?.users.map((item) => {
          preloadImage(item.profile_picture) // Images are preloaded so they are no delay displaying each user's avatar
          // With pwa enabled this approach store image in the cache so the images are fetched from cache
          return {
            id: item.id,
            email: item.email,
            avatar: item.profile_picture,
            pseudo: item.last_name
          }
        })
        return post_users.value
      }
      return []
    } catch (error) {
      console.error('🚀 ~ file: users.ts:16 ~ fetchAllUsers ~ error:', error);
      post_users.value = [];
      return []
    }
  }

  const resetPostsData = async () => {
    post_users.value = []
    posts.value = []
  }

  return {
    isLoading,
    posts,
    loadPosts,
    fetchAllUsers,
    resetPostsData
  };
});
