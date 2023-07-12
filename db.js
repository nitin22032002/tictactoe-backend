const mongoose=require("mongoose");

const connectDb=()=>{
    let db=mongoose.connect(process.env.CONNECTION_STRING);
} 

module.exports=connectDb 