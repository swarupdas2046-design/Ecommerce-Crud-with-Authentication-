import jwt from 'jsonwebtoken'

export const GenerateAccessToken = (Userid,UserEmail)=>{
    return jwt.sign({Userid,UserEmail},process.env.JWT_SECRET_KEY,{
        expiresIn:"15min"
    })
}

export const GenerateRefreshToken = (Userid,UserEmail)=>{
    return jwt.sign({Userid,UserEmail},process.env.JWT_SECRET_KEY,{
        expiresIn:"1d"
    })
}

