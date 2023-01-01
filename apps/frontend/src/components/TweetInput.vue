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
    <span class="text-white/80 text-xs font-mono font-bold mb-2 ml-3">{{ content.length }} / 120</span>
    <form @submit.prevent="sendTweet" class="flex flex-row space-x-2 sm:space-x-3">
      <div class="flex-1 flex rounded-md overflow-hidden relative">
        <input 
          autocomplete="off"
          v-model="content"
          maxlength="120"
          class="px-3 py-2 min-w-0 flex-1 bg-white/5 placeholder-white/50 text-white text-lg focus:outline-none focus:bg-white/10" 
          name="tweet" 
          type="text" 
          placeholder="Tweet something ...">
        <div class="h-0.5 absolute bottom-0 left-0 right-0 overflow-hidden">
          <div 
            :style="`width: ${(content.length / 120) * 100}%;`"
            class="bg-accent h-1 rounded-full transition-all"></div>
        </div>
      </div>
      <button 
        :disabled="content.length < 2"
        class="flex items-center px-5 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-50" 
        type="submit">
        <span class="material-symbols-outlined">send</span>
      </button>
    </form>
  </div>
</template>