import { GenerateAccessToken, GenerateRefreshToken } from '../Utils/Token.js'
import { AuthModel } from '../Models/auth.model.js'
import jwt from 'jsonwebtoken'
// ----- create userRegister Controller -----
export const UserRegister = async(req,res)=>{
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
}
// ----- create userLogin Controller -----
export const UserLogin = async(req,res)=>{
    try {
        // ----- Get the data from the request body -----
        const {email,password} = req.body
        // ----- Check if all the fields are present -----
        if(!email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        // ----- Check if the user already exists -----
        const IsExisted = await AuthModel.findOne({email})

        if(!IsExisted){
            return res.status(400).json({
                message:"User not found"
            })
        }


        // ----- Check if the password is correct -----
        const ValidPassword = IsExisted.ComparePassword(password)

        if (!ValidPassword) {
            return res.status(404).json({
                message:"Wrong Password"
            })
        }

         // ----- Generate JWT token -----
        const AccessToken = GenerateAccessToken(IsExisted._id,IsExisted.email)
        const RefreshToken = GenerateRefreshToken(IsExisted._id,IsExisted.email)

        // ----- Update the refresh token -----
        IsExisted.refreshToken = RefreshToken
        await IsExisted.save()

        // ----- Set the cookies -----
        res.cookie("accessToken",AccessToken,{
            httpOnly:true
        })
        res.cookie("refreshToken",RefreshToken,{
            httpOnly:true
        })

        // ----- Send the response -----
        return res.status(200).json({
            message:"User Login SuccessFully",
            user:IsExisted
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.message,
        })
    }
}
// ----- get refresh token Controller -----
export const GetRefreshToken = async(req,res)=>{
try {
        // ----- Get the refresh token from the cookies -----
        const refreshToken = req.cookies.refreshToken
    // ----- Check if the refresh token is present -----
    if (!refreshToken) {
        return res.status(404).json({
            message:"Token Not Found",
            
        })
    }
    // ----- Verify the refresh token -----
    const Decode = jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY)

    // ----- Check if the token is valid -----
    if (!Decode) {
        return res.status(401).json({
            message:"Invalid Token",
        
        })
    } 
    // ----- Check the user exists or not -----

   const User = await AuthModel.findOne({
    _id: Decode.Userid,
    email: Decode.UserEmail
})
    // ----- If not found -----
     if (!User) {
      return res.status(404).json({
        massage: "Unauthorized User",
        
      });
    }
        // ----- Check if the refresh token is valid -----
    if (refreshToken !== User.refreshToken) {
        return res.status(401).json({
        massage: "Unauthorized User",
        
    });
    }
        // ----- Generate a new access token -----
    const AccessToken = GenerateAccessToken(User._id,User.email)
        // ----- Set the access token in the cookies -----
    res.cookie("accessToken",AccessToken,{
        httpOnly:true,
    })
        // ----- Send the response -----
    return res.status(200).json({
      massage: "AccessToken generated",
    });
    

} catch (error) {
    return res.status(500).json({
        message:"Internal Server error",
        error:error.message
    })
}

}