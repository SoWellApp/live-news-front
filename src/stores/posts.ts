import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Post, User } from 'src/types';
import { ref } from 'vue';
import localforage from 'localforage';
export const usePostStore = defineStore('posts', () => {
  const isLoading = ref(false);
  const posts = ref<Post[]>([]);
  const limit = ref(10);
  let simulationIntervalId: ReturnType<typeof setInterval> | null = null;

  const loadPosts = async (loadMore = true) => {
    const currentCount = posts.value.length;
    limit.value = currentCount + 10;

    try {
      const storedPosts: any = await localforage.getItem('posts');

      if (storedPosts !== null) {
        if (loadMore) {
          const val = storedPosts.slice(currentCount, limit.value);
          // Add the new data to the end of the existing array
          posts.value = [...posts.value, ...val];
        }

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
      const storedPosts: any = await localforage.getItem('posts');

      if (response.status === 200 && storedPosts === null) {
        const result = response.data;

        // display the first 10 posts
        posts.value = result.slice(0, limit.value);

        // Store the data locally all the data (offline) in localforage
        localforage.setItem('posts', result);
      } else {
        posts.value = storedPosts;
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

  const simulateNewPost = () => {
    simulationIntervalId = setInterval(async () => {
      const newPost: Post = {
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        id: posts.value.length + 1,
        title: 'New Post Title ' + posts.value.length + 1,
        body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae exercitationem consectetur vel necessitatibus natus obcaecati voluptates et dignissimos praesentium magni!',
        author: generateRandomUser(),
      };
      let storedPosts: any = await localforage.getItem('posts');

      // Prepend the new post
      storedPosts = [newPost, ...storedPosts];

      // Update the 'posts' array in the component
      posts.value = [newPost, ...posts.value.slice(0, limit.value - 1)];
      loadPosts(false);

      await localforage.setItem('posts', storedPosts);
    }, 5000); // Set interval to 5 seconds
  };

  const stopSimulation = () => {
    if (simulationIntervalId !== null) {
      clearInterval(simulationIntervalId);
      simulationIntervalId = null;
    }
  };

  const generateRandomUser = (): User => {
    return {
      id: Math.floor(Math.random() * 1000),
      pseudo: 'lorem',
      email: 'lorem@example.com',
      avatar: `https://source.unsplash.com/random/300x200?sig=${Math.random()}`,
    };
  };

  return {
    isLoading,
    posts,
    loadPosts,
    fetchPosts,
    resetStore,
    simulateNewPost,
    stopSimulation,
  };
});
