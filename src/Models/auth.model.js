import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const AuthSchema = new mongoose.Schema({
    name:{    
        type: String,
        required: true
    },
    email:{    
        type: String,
        required: true
    },
    password:{    
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true,
        min:1000000000,
        max:9999999999,
    },
    user:{
        type: String,
    }
},{
    timestamps: true,
})
// ------ Hash the password before saving the user ------
AuthSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return 
    }
    this.password = bcrypt.hashSync(this.password,10)
})
// ------- Method to compare entered password with hashed password -------
AuthSchema.method.ComparePassword = function(password) {
    return bcrypt.compareSync(password,this.password)
}


export const AuthModel = mongoose.model("Auth",AuthSchema)