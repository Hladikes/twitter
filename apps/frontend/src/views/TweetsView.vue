<script setup lang="ts">
  import { trpc } from '@/plugins/trpc'
  import { onMounted, ref } from 'vue'
  import Alert from '@/components/Alert.vue'
  import { useAlert } from '@/plugins/hooks/alert'
  import TweetItem from '@/components/TweetItem.vue'
  import type { RouterOutput } from '@/types'
  import TweetInput from '@/components/TweetInput.vue'

  const alert = useAlert()
  const tweets = ref<RouterOutput['tweet']['getAllTweets']>([])
  
  function fetchAllTweets() {
    trpc.tweet.getAllTweets.query()
      .then((t) => tweets.value = t)
      .catch((err) => alert.show('Error while fetching tweets', true))
  }
  
  onMounted(() => {
    fetchAllTweets()  
  })

  function deleteTweetLocally(tweetId: number) {
    const idx = tweets.value?.findIndex((t) => t.id === tweetId) ?? -1
    if (idx !== -1) {
      tweets.value?.splice(idx, 1)
    }
  }
</script>

<template>
  <div class="flex-1 flex flex-col sm:p-4 space-y-5">
    <h1 class="text-white text-4xl ml-4 mt-6">Home</h1>

    <div class="p-3 sm:p-4 sm:pt-5 border-y sm:border border-white/10  sm:rounded-lg">
      <TweetInput @send="fetchAllTweets()" />
    </div>

    <div class="pb-10">
      <Alert :alert="alert" />
      <div class="divide-y divide-white/10">
        <div v-for="tweet in tweets" :key="tweet.id">
          <TweetItem
            :id="tweet.id"
            :username="tweet.author.username"
            :user-id="tweet.author.id"
            :profile-picture="tweet.author.profilePicture ?? ''"
            :content="tweet.content"
            :is-liked="tweet.likes.length > 0"
            :created-at="tweet.createdAt"
            :likes-count="tweet._count.likes"
            :comments-count="tweet._count.comments"
            @delete="deleteTweetLocally(tweet.id)" />
        </div>
      </div>
    </div>
  </div>
</template>