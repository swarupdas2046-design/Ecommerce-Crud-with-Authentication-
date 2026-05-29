import express from 'express'
import { GetRefreshToken, UserLogin, UserRegister } from '../Controllers/auth.controller.js'



const Router = express.Router()



// ----- get refresh token api -----
Router.get("/getRefreshToken",GetRefreshToken)

// ----- register api -----

Router.post("/register",UserRegister)

// ----- login api -----

Router.post("/login",UserLogin)




export default Router