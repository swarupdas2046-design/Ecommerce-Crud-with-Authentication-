import express from 'express'
import cookie from 'cookie-parser'
import Router from './Routes/auth.routes.js'

// ----- Create the express app -----
const app = express()

// ----- Middlewares -----
app.use(express.json())

// ----- Cookie parser -----
app.use(cookie())

// ----- Auth routes -----
app.use("/api/auth",Router)



export default app