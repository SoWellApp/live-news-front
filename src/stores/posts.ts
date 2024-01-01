import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { ApiPostResponse, ApiUsersResponse, Post, User } from 'src/types';
import { ref } from 'vue';
import preloadImage from 'src/utils/preloadImage';
import { localforage } from 'src/boot/localforage';
import queryString from 'query-string';
export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const posts = ref<Post[]>([]);
  const post_users = ref<User[]>([])
  const pagination = ref({
    offset: 0,
    limit: 10
  })

  const loadPosts = async (offset = 0) => {
    // If the current offset and the offset provided in the func params are different, then we are in a load more event
    const loadMore = offset != pagination.value?.offset
    if (loadMore) {
      isLoadingMore.value = true
    } else {
      isLoading.value = true;
      posts.value = [];
    }
    pagination.value = {
      ...pagination.value,
      offset
    }
    try {
      const localPosts: string = await localforage.getItem('posts') || ''
      // Only fetch from API if the local posts are empty or we are in a load more event triggered by an infinite scroll
      if (!localPosts || loadMore) {
        const response = await api.get<ApiPostResponse>('/blog-posts?' + queryString.stringify(pagination.value));
        if (response.status === 200) {
          // We need to attach each post to it's right author
          const mappedPosts = response.data?.blogs.map((item) => {
            item.author = post_users.value.find((user) => user.id === item.user_id) || null
            return item
          });
          // Sort posts by created_at in descending order (newest first)
          posts.value = [...posts.value, ...mappedPosts].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); // the "+" is there to cast the date object to number
          // Now let's update or create the local posts object
          // const postsData = localPosts ? [...JSON.parse(localPosts), ...posts.value] : posts.value
          await localforage.setItem('posts', JSON.stringify(posts.value))
        }
      } else {
        posts.value = JSON.parse(localPosts)
      }
    } catch (error) {
      console.error('🚀 ~ file: posts.ts:16 ~ loadPosts ~ error:', error);
      if (!loadMore) posts.value = [];
    } finally {
      if (loadMore) {
        isLoadingMore.value = false;
      } else {
        isLoading.value = false;
      }
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get<ApiUsersResponse>('/users?limit=50');
      if (response.status === 200 && response.data?.users) {
        post_users.value = response.data?.users.map((item) => {
          preloadImage(item.profile_picture) // Images are preloaded so they are no delay displaying each user's avatar
          // With pwa enabled this approach store image in the cache so the images are fetched from there
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
    // Clear all posts data
    post_users.value = []
    posts.value = []
    localforage.removeItem('posts')
  }

  const updatePagination = (offset = 0) => {
    pagination.value = {
      ...pagination.value,
      offset
    }
  }

  return {
    isLoading,
    posts,
    pagination,
    isLoadingMore,
    loadPosts,
    fetchAllUsers,
    resetPostsData,
    updatePagination
  };
});
