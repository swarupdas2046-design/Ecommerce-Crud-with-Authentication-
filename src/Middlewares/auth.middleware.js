import jwt from 'jsonwebtoken'
import { AuthModel } from '../Models/auth.model.js'

export const AuthMiddleware = async(req,res,next)=>{
    try {
        // ----- Get the access token from the cookies -----
        const Token = req.cookies.accessToken
        if (!Token) {
            return res.status(401).json({
                message:"Token Not Found"
            })
        }
        // ----- Verify the access token -----
        const Decode = jwt.verify(Token,process.env.ACCESS_SECRET_KEY)
        
        console.log("Decode ------>",Decode);
        
        // ----- Check if the token is valid -----
        
        // ----- Check the user exists or not -----
        const User = await AuthModel.findOne({
            _id : Decode.Userid,
            email: Decode.UserEmail,
        })
        // ----- If not found -----
        if (!User) {
            return res.status(404).json({
                message:"User Not Found"
            })
        }
        // ----- If found -----
        console.log("User ----->",User);
        req.User = User
        next()
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
    }
}