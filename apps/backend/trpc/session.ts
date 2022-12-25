import { TRPCError } from '@trpc/server'
import { middleware } from './index'

const sessions = new Map<string, any>()

function isValid(sid: string) {
  return sessions.has(sid)
}

export function createSession(sid: string, maxAge: number) {
  clearTimeout(sessions.get(sid))
  sessions.set(sid, setTimeout(() => {
    sessions.delete(sid)
  }, maxAge))
}

export const sessionGuard = middleware(({ ctx, next }) => {
  if (ctx.cookies.session && isValid(ctx.cookies.session)) {
    return next()
  }
  
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'Unauthorized',
  })
})