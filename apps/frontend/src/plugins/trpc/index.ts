import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from 'backend/trpc'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: location.hostname.includes('localhost') ? 'http://localhost:8080/trpc' : '/trpc',
      maxURLLength: 2083,
    })
  ]
})