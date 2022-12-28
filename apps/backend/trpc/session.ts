import { TRPCError } from '@trpc/server'
import { middleware } from './index'

type User = {
  id: number
  username: string
  email: string
}

const sessions = new Map<string, { timeoudId: any, user: User }>()

function isValid(sid: string) {
  return sessions.has(sid)
}

export function createSession(sid: string, user: User, maxAge: number) {
  clearTimeout(sessions.get(sid)?.timeoudId)
  
  sessions.set(sid, {
    timeoudId: setTimeout(() => {
      sessions.delete(sid)
    }, maxAge),
    user,
  })
}

export function deleteSession(sid: string) {
  clearTimeout(sessions.get(sid)?.timeoudId)
  sessions.delete(sid)
}

export const sessionGuard = middleware(({ ctx, next }) => {
  if (ctx.cookies.session && isValid(ctx.cookies.session) && sessions.has(ctx.cookies.session)) {
    return next({
      ctx: {
        user: sessions.get(ctx.cookies.session)!.user
      },
    })
  }
  
  ctx.cookie('session', 0, {
    expires: new Date(0),
  })

  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'Unauthorized',
  })
})