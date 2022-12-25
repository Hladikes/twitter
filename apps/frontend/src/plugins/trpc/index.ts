import { createTRPCProxyClient, httpBatchLink, TRPCClientError } from '@trpc/client'
import type { AppRouter } from 'backend/trpc'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: location.hostname.includes('localhost') ? 'http://localhost:8080/trpc' : '/trpc',
      maxURLLength: 2083,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    })
  ]
})

export function getErrorMessage(err: TRPCClientError<AppRouter>): string[] {
  if (err.shape?.data.zodError) {
    return Object.values(err.shape?.data.zodError.fieldErrors).map(String)
  }

  return [err.message || 'Unknown error']
}