import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { sessionGuard } from '../session'
import { prisma } from '../../prisma'
import { Prisma } from '@prisma/client'

export const tweetRouter = router({
  createTweet: publicProcedure.use(sessionGuard).input(z.object({
    content: z
      .string()
      .min(2, { message: 'Tweet must be at least 2 characters long' })
      .max(120, { message: 'Maximum number of characters is 120' }),
    parentId: z.number().optional(), 
  })).mutation(async ({ ctx, input }) => {
    try {
      const tweet = await prisma.tweet.create({
        data: {
          content: input.content,
          authorId: ctx.user.id,
          ...(input.parentId ? { parentId: input.parentId } : {})
        },
      })
      
      return tweet
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unkown error has occoured',
        })
      }
    }
  }),

  getAllTweets: publicProcedure.use(sessionGuard).query(async ({ ctx }) => {
    try {
      const tweets = await prisma.tweet.findMany({
        orderBy: { createdAt: 'desc', },
        where: {
          parentId: {
            equals: null,
          }
        },
        select: {
          id: true,
          content: true,
          author: { select: { id: true, username: true, profilePicture: true, } },
          likes: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              id: true,
              userId: true,
            }
          },
          createdAt: true,
          updatedAt: true,
          parent: {
            select: {
              id: true,
              content: true,
              author: { select: { id: true, username: true, profilePicture: true, } },
            }
          },
          _count: true,
        }
      })
      
      return tweets
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unkown error has occoured',
        })
      }
    }
  }),

  getTweet: publicProcedure.use(sessionGuard).input(
    z.object({
      tweetId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    try {
      const tweet = await prisma.tweet.findFirst({
        where: {
          id: input.tweetId,
        },
        select: {
          id: true,
          content: true,
          author: { select: { id: true, username: true, profilePicture: true, } },
          comments: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              content: true,
              author: { select: { id: true, username: true, profilePicture: true, } },
              likes: {
                where: {
                  userId: ctx.user.id,
                },
                select: {
                  id: true,
                  userId: true,
                }
              },
              createdAt: true,
              updatedAt: true,
              _count: true,
            }
          },
          likes: {
            where: {
              userId: ctx.user.id,
            },
          },
          _count: {
            select: {
              likes: true
            }
          },
          createdAt: true,
          updatedAt: true,
        }
      })
  
      return tweet
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unkown error has occoured',
      })
    }
  }),

  likeTweet: publicProcedure.use(sessionGuard).input(
    z.object({
      tweetId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    try {
      await prisma.like.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.user.id,
        }
      })
    } catch (err) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Could not like the post',
      })
    }
  }),

  unlikeTweet: publicProcedure.use(sessionGuard).input(
    z.object({
      tweetId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    try {
      await prisma.like.deleteMany({
        where: {
          userId: ctx.user.id,
          tweetId: input.tweetId,
        }
      })
    } catch (err) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Could not remove like from the post',
      })
    }
  }),

  deleteTweet: publicProcedure.use(sessionGuard).input(
    z.object({
      tweetId: z.number(),
    })
  ).mutation(async ({ ctx, input }) => {
    try {
      await prisma.tweet.deleteMany({
        where: {
          AND: [
            { authorId: ctx.user.id },
            { id: input.tweetId }
          ]
        },
      })
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not delete this tweet'
      })
    }
  })
})