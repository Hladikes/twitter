<script setup lang="ts">
  import TweetItem from '@/components/TweetItem.vue'
  import { onBeforeMount, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import TweetInput from '@/components/TweetInput.vue'
  import type { RouterOutput } from '@/types'
  import { trpc } from '@/plugins/trpc'
  import Router from '@/router'

  const route = useRoute()
  const tweet = ref<RouterOutput['tweet']['getTweet'] | null>(null)

  function fetchTweet() {
    trpc.tweet.getTweet.query({
      tweetId: Number(route.params.id),
    }).then((t) => {
      tweet.value = t
    })
  }

  onBeforeMount(() => {
    fetchTweet()    
  })

  watch(route, () => {
    fetchTweet()
  })
</script>

<template>
  <div class="sm:p-3 space-y-3">
    <div class="border-b border-white/10">
      <button @click="Router.go(-1)" class="text-white hover:text-lime-400">
        <span class="material-symbols-outlined p-4">arrow_back</span>
      </button>
    </div>

    <template v-if="tweet">
      <TweetItem
        :id="tweet.id"
        :username="tweet.author.username"
        :profile-picture="tweet.author.profilePicture ?? ''"
        :content="tweet.content"
        :is-liked="tweet.likes.length > 0"
        :created-at="tweet.createdAt"
        :likes-count="tweet._count.likes"
        :comments-count="tweet.comments.length" />


      <div class="px-3">
        <TweetInput @send="fetchTweet()" :tweet-id="Number(route.params.id)" />
      </div>

      <hr class="border-white/10">

      <h1 class="text-white px-3">Comments</h1>

      <div class="divide-y divide-white/10 pb-10">
        <TweetItem
          v-for="comment in tweet.comments"
          :id="comment.id"
          :username="comment.author.username"
          :profile-picture="comment.author.profilePicture ?? ''"
          :content="comment.content"
          :is-liked="comment.likes.length > 0"
          :created-at="comment.createdAt"
          :likes-count="comment._count.likes"
          :comments-count="comment._count.comments" />
      </div>
    </template>
  </div>
</template>