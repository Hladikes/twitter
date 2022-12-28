<script setup lang="ts">
  import { ref } from 'vue'
  import { trpc } from '@/plugins/trpc'

  const props = defineProps<{
    tweetId?: number
  }>()

  const emit = defineEmits(['send'])
  const content = ref('')

  function sendTweet(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement)
    const tweet = String(formData.get('tweet'))

    trpc.tweet.createTweet.mutate({
      content: tweet,
      ...(props.tweetId ? { parentId: props.tweetId } : {})
    })
      .then(() => {
        content.value = ''
        emit('send')
      })
      .catch((err) => {})
  }
</script>

<template>
  <div class="flex flex-col">
    <span class="text-white text-xs font-bold mb-2 ml-3">{{ content.length }} / 120</span>
    <form @submit.prevent="sendTweet" class="flex flex-row space-x-2 sm:space-x-3">
      <input 
        v-model="content"
        maxlength="120"
        class="px-3 py-2 min-w-0 bg-white/5 flex-1 placeholder-white/50 text-white text-lg rounded-md focus:outline-none focus:bg-white/10" 
        name="tweet" 
        type="text" 
        placeholder="Tweet something ...">
      <button 
        :disabled="content.length < 2"
        class="px-5 py-2 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-50" 
        type="submit">Send</button>
    </form>
  </div>
</template>