import { router, publicProcedure } from '../index'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { sessionGuard, createSession } from '../session'

export type User = {
  id: number
  username: string
  email: string
  password?: string
}

const users: User[] = [
  {
    id: 0,
    email: 'user1@mail.com',
    username: 'user1',
    password: '56334737684af8c521a741061a5a1c32df76bbab0648fcb6753b4512b3e23e36',
  },
  {
    id: 1,
    email: 'user2@mail.com',
    username: 'user2',
    password: '56334737684af8c521a741061a5a1c32df76bbab0648fcb6753b4512b3e23e36',
  },
  {
    id: 2,
    email: 'user3@mail.com',
    username: 'user3',
    password: '56334737684af8c521a741061a5a1c32df76bbab0648fcb6753b4512b3e23e36',
  },
]

export const userRouter = router({
  register: publicProcedure.input(z.object({
    username: z.string().min(4, { message: 'Username must be at least 4 characters long' }),
    email: z.string().email({ message: 'Invalid e-mail address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  })).mutation(({ input }) => {
    users.push({
      id: (Math.random() * 1000000) | 0,
      username: input.username,
      email: input.email,
      password: input.password,
    })
  }),

  login: publicProcedure.input(z.object({
    username: z.string(),
    password: z.string(),
  })).mutation(({ ctx, input }): Omit<User, 'password'> => {
    const user = users.find((u) => {
      return u.username === input.username && u.password === input.password
    })
    
    if (user) {
      const maxAge = 1000 * 60
      const sid = Math.random().toString(36).substring(2) 

      ctx.cookie('session', sid, { maxAge })
      createSession(sid, user, maxAge)
      
      return {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    }

    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Invalid login credentials',
    })
  }),

  logout: publicProcedure.use(sessionGuard).input(() => {}).query(({ ctx }) => {
    ctx.cookie('session', 0, {
      expires: new Date(0),
    })
    
    return null
  }),

  checkSession: publicProcedure.use(sessionGuard).input(() => {}).query(({ ctx }) => {
    return ctx.user
  }),

  getAllUsers: publicProcedure.use(sessionGuard).input(() => {}).query(() => {
    return users
  })
})