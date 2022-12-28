<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { trpc } from '@/plugins/trpc'
  import { RouterLink } from 'vue-router'

  const props = defineProps<{
    username: string
    profilePicture: string
    content: string
    id: number
    createdAt: string
    likesCount: number
    commentsCount: number
    isLiked: boolean
  }>()

  const isLiked = ref(props.isLiked)
  const likesCount = ref(props.likesCount)

  watch(props, () => {
    isLiked.value = props.isLiked
    likesCount.value = props.likesCount
  })

  function like() {
    trpc.tweet.likeTweet.query({
      tweetId: props.id,
    }).then(() => {
      isLiked.value = true
      likesCount.value += 1
    })
  }
  
  function removeLike() {
    trpc.tweet.unlikeTweet.query({
      tweetId: props.id,
    }).then(() => {
      isLiked.value = false
      likesCount.value -= 1
    })
  }
</script>

<template>
  <RouterLink 
    :to="{ path: `/tweet/${props.id}` }"
    class="px-3 py-3 sm:p-3 hover:cursor-pointer sm:hover:bg-white/5 flex flex-row space-x-2 sm:space-x-4">
    <div class="h-12 w-12 bg-white/5 rounded-full"></div>
    <div class="flex-1 flex flex-col">
      <div class="flex flex-col justify-center items-start">
        <p class="text-white flex flex-row items-center space-x-2">
          <span class="font-medium text-lg">{{ props.username }}</span>
          <span class="text-xs opacity-50"> • {{ new Date(props.createdAt).toLocaleDateString() }}</span>
        </p>
      </div>
      <div>
        <p class="text-white/80 text-base sm:text-xl break-words">{{ props.content }}</p>
      </div>
      <div class="mt-2 flex flex-row items-center space-x-2">
        <button 
          @click.prevent="isLiked ? removeLike() : like()"
          :class="{
            'text-red-400 bg-red-500/10': isLiked,
            'text-white bg-white/5': !isLiked,
          }"
          class="flex items-center space-x-2 font-medium py-0.5 px-3 rounded-full">
          <span>{{ likesCount }}</span>
          <span class="material-symbols-outlined text-base">favorite</span>
        </button>
        <span class="flex items-center space-x-2 font-medium py-0.5 px-3 rounded-full text-white/50">
          <span>{{ props.commentsCount }}</span>
          <span class="material-symbols-outlined text-base">comment</span>
        </span>
      </div>
    </div>
  </RouterLink>
</template>