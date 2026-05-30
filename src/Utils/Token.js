import jwt from 'jsonwebtoken'
// ----- Generate JWT token -----
export const GenerateAccessToken = (Userid,UserEmail)=>{
    return jwt.sign({Userid,UserEmail},process.env.ACCESS_SECRET_KEY,{
        expiresIn:"15min"
    })
}
// ----- Generate JWT token -----
export const GenerateRefreshToken = (Userid,UserEmail)=>{
    return jwt.sign({Userid,UserEmail},process.env.REFRESH_SECRET_KEY,{
        expiresIn:"1d"
    })
}


