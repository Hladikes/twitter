import * as trpcExpress from '@trpc/server/adapters/express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { appRouter, createContext } from './trpc'

const PORT = 8080
const app = express()

app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173']
}))
app.use(cookieParser())
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
}))

app.listen(PORT, () => {
  console.log(`[i] Server is running at :${PORT}`)
})