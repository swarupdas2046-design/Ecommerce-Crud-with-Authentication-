import express from 'express'
import { AuthModel } from '../Models/auth.model.js'
import jwt from 'jsonwebtoken'
import { GenerateAccessToken, GenerateRefreshToken } from '../Utils/Token.js'
import { GetRefreshToken, UserLogin, UserRegister } from '../Controllers/auth.controller.js'
import { error } from 'node:console'
const Router = express.Router()



// ----- get refresh token api -----
Router.get("/getRefreshToken",GetRefreshToken)

// ----- register api -----

Router.post("/register",UserRegister)

// ----- login api -----

Router.post("/login",UserLogin)




export default Router