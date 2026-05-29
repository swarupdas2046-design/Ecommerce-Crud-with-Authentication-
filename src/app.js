import express from 'express'
import cookie from 'cookie-parser'
import Router from './Routes/auth.routes.js'
import Routes from './Routes/file.route.js'

// ----- Create the express app -----
const app = express()

// ----- Middlewares -----
app.use(express.json())

// ----- Cookie parser -----
app.use(cookie())

// ----- Auth routes -----
app.use("/api/auth",Router)

// ----- Product routes -----
app.use("/api/product",Routes)

export default app