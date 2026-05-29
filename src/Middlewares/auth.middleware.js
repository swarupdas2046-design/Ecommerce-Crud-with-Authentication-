import jwt from 'jsonwebtoken'
import { AuthModel } from '../Models/auth.model.js'

export const AuthMiddleware = async(req,res,next)=>{
    try {
        const Token = req.cookies.accessToken
        if (!Token) {
            return res.status(401).json({
                message:"Token Not Found"
            })
        }

        const Decode = jwt.verify(Token,process.env.ACCESS_SECRET_KEY)
        
        console.log("Decode ------>",Decode);
        

        if (!Decode) {
            return res.status(401).json({
                message:"Invalid User"
            })
        }

        const User = await AuthModel.findOne({
            _id : Decode.Userid,
            email: Decode.UserEmail,
        })

        if (!User) {
            return res.status(404).json({
                message:"User Not Found"
            })
        }
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