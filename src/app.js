import express from 'express'
import cookie from 'cookie-parser'
import Router from './Routes/auth.routes.js'
const app = express()
app.use(express.json())
app.use(cookie())

app.use("/api/auth",Router)

export default app