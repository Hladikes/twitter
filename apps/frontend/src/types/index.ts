import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from 'backend/trpc'

export type RouterOutput = inferRouterOutputs<AppRouter>
