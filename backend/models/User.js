import mongoose from "mongoose";

const userSchema= new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    passwordhash:{
        type:String,
        required:true,
    }
})



//model 

const User= mongoose.model("User",userSchema);

export default User;
