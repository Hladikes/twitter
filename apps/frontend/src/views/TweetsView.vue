<script setup lang="ts">
  import { trpc } from '@/plugins/trpc'
  import { onMounted, ref } from 'vue'
  import Error from '@/components/Error.vue'
  import { useError } from '@/plugins/hooks/error'
  import TweetItem from '@/components/TweetItem.vue'
  import type { Tweet } from '@/types'
  import TweetInput from '@/components/TweetInput.vue'

  const error = useError()
  const tweets = ref<Tweet[]>([])
  
  function fetchAllTweets() {
    trpc.tweet.getAllTweets.query()
      .then((t) => tweets.value = t)
      .catch((err) => error.show('Error while fetching tweets'))
  }
  
  onMounted(() => {
    fetchAllTweets()  
  })
</script>

<template>
  <div class="flex-1 flex flex-col sm:p-4 space-y-5">
    <h1 class="text-white text-4xl ml-4 mt-6">Home</h1>

    <div class="p-3 sm:p-4 sm:pt-5 border-y sm:border border-white/5  sm:rounded-lg">
      <TweetInput @send="fetchAllTweets()" />
    </div>

    <div class="pb-10">
      <Error :error="error" />
      <div class="divide-y divide-white/10">
        <div v-for="tweet in tweets" :key="tweet.id">
          <TweetItem :tweet="tweet" />
        </div>
      </div>
    </div>
  </div>
</template>