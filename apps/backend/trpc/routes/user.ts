import { router, publicProcedure } from '../index'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

type User = {
  id: number
  username: string
  email: string
  password?: string
}

const users: User[] = [
  {
    id: 0,
    email: 'test@gmail.com',
    username: 'test',
    password: 'test',
  }
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
  })).mutation(({ input }) => {
    const user = users.find((u) => u.username === input.username && u.password === input.password)

    if (!user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid credentials'
      })
    }

    const clone = { ...user }
    delete clone.password
    return clone
  }),

  getAllUsers: publicProcedure.input(() => {}).query(() => {
    return users
  })
})