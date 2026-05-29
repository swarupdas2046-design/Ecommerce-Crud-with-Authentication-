import express from 'express'
import { AuthModel } from '../Models/auth.model.js'
import jwt from 'jsonwebtoken'
import { GenerateAccessToken, GenerateRefreshToken } from '../Utils/Token.js'
const Router = express.Router()

Router.post("/register",async(req,res)=>{
    try {
        // ----- Get the data from the request body -----
        const {name,email,password,mobile} = req.body

        // ----- Check if all the fields are present -----
        if(!name || !email || !password || !mobile){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        // ----- Check if the user already exists -----
        const user = await AuthModel.findOne({email})
        if(user){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        // ----- Create a new user -----
        const NewUser = await AuthModel.create({
            name,
            email,
            password,
            mobile,
        }) 

        // ----- Generate JWT token -----
        const AccessToken = GenerateAccessToken(NewUser._id,NewUser.email)
        const RefreshToken = GenerateRefreshToken(NewUser._id,NewUser.email)

        // ----- Save the refresh token in the database -----
        NewUser.refreshToken = RefreshToken
        await NewUser.save()
        
        // ----- Set the JWT token in the cookie -----
        res.cookie("accessToken",AccessToken,{
            httpOnly: true,
        })
        res.cookie("refreshToken",RefreshToken,{
            httpOnly: true,
        })


        // ----- Send the response -----

        return res.status(201).json({
            message:"User created successfully",
            user:NewUser,
        })


    } catch (error) {
        return res.status(5000).json({
            message:"Internal Server Error",
            error:error.message,
        })
    }
})


export default Router