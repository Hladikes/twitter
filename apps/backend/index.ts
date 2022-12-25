import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter, createContext } from './trpc'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

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