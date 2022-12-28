import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { createSession, sessionGuard } from '../session'
import { prisma } from '../../prisma'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

export const userRouter = router({
  register: publicProcedure.input(z.object({
    username: z.string().min(4, { message: 'Username must be at least 4 characters long' }),
    email: z.string().email({ message: 'Invalid e-mail address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  })).mutation(async ({ input }) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(input.password, salt)
    
    try {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          password: hash,
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      })

      return user
    } catch (err) {
      let msg = 'An unknown error has occoured'

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          msg = 'User with this e-mail or username already exists'
        }
      }

      throw new TRPCError({
        code: 'FORBIDDEN',
        message: msg,
      })
    }
  }),

  login: publicProcedure.input(z.object({
    email: z.string(),
    password: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: input.email 
      },
    })

    if (!user || !bcrypt.compareSync(input.password, user?.password)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid login credentials',
      })
    }

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
    }

    const maxAge = 1000 * 60 * 60
    const sid = Math.random().toString(36).substring(2) 

    ctx.cookie('session', sid, { maxAge })
    createSession(sid, userWithoutPassword, maxAge)
    
    return userWithoutPassword
  }),

  logout: publicProcedure.use(sessionGuard).query(({ ctx }) => {
    ctx.cookie('session', 0, {
      expires: new Date(0),
    })
    
    return null
  }),

  checkSession: publicProcedure.use(sessionGuard).query(({ ctx }) => {
    return ctx.user
  }),
})