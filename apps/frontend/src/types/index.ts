import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from 'backend/trpc'

type RouterOutput = inferRouterOutputs<AppRouter>
type Tweets = RouterOutput['tweet']['getAllTweets']

export type Tweet = Tweets[number]
