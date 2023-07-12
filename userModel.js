const mongoose=require("mongoose");

const userModel=new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
    },
    emailid:{
        type:String,
        require:true,
    },
    score:{
        type:Number,
        default:0,
    },
    match:{
        type:Number,
        default:0,
    },
    token:{
        type:String,
        default:""
    }
})

module.exports=mongoose.model("user",userModel);