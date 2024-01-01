<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar v-if="post.author">
          <img :src="post.author.avatar" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ post.title }}</q-item-label>
        <q-item-label caption>posted by {{ post.author?.pseudo || "" }},
          {{ formatDate(post.updated_at) }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section horizontal>
      <q-card-section>
        {{ post.content_text }}
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import dayJS from 'dayjs';
import { Post } from 'src/types';
import { PropType } from 'vue';

defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true,
  },
});

const formatDate = (date: string) => {
  return dayJS(date).format('DD/MM/YYYY HH:mm');
};
</script>
<style scoped lang="sass">
.my-card
  background-color: white
</style>
