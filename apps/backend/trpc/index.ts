import type { inferAsyncReturnType } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'
import type { CookieOptions } from 'express'
import { ZodError } from 'zod'

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
  cookies: req.cookies,
  cookie: (name: string, value: number | string, options: CookieOptions) => {
    res.cookie(name, value, options)
  },
})

type Context = inferAsyncReturnType<typeof createContext>
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  }
})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure

import { userRouter } from './routes/user'

export const appRouter = t.router({
  user: userRouter
})
 
export type AppRouter = typeof appRouter