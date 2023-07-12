const express=require("express");

const router=express.Router()

const userModel=require("./userModel")

const {verifyToken,generateToken}=require("./middleware")

const jwt=require("jsonwebtoken")

router.get("/",verifyToken,async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let user=await userModel.findById(user_id);
        return res.status(200).json({status:true,data:{name:user.user_name,emailid:user.emailid,score:user.score,match:user.match}});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error...."})
    }
})

router.post("/login",async(req,res,next)=>{
    try{
        let {token}=req.body;
        if(token){
            let data=jwt.decode(token);
            let {name,email}=data;
            let user=await userModel.findOne({emailid:email});
            if(!user){
                user=await userModel.create({user_name:name,emailid:email});
            }
            let user_token=generateToken({_id:user._id,token});
            user.token=user_token;
            let r=await user.save();
            return res.status(200).json({status:true,token:user_token});
        }
        else{
            return res.status(400).json({status:false,error:"Bad Request...."})
        }
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error...."})
    }
})

router.get("/score/:score",verifyToken,async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let {score}=req.params;
        score=parseInt(score);
        if(score!==undefined){
            if(score<0){
                score=0;
            }
            let user=await userModel.findById(user_id);
            user.score+=score;
            user.match+=1;
            let r=await user.save()
            return res.status(200).json({status:true})
        }
        else{
            return res.status(400).json({status:false,error:"Bad Request...."})
        }
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error...."})
    }
})

router.get("/logout",verifyToken,async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let user=await userModel.findById(user_id);
        user.token="";
        let r=await user.save();
        return res.status(200).json({status:true});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error...."})
    }
})

router.get("/leaderboard",verifyToken,async(req,res,next)=>{
    try{
        let users = await userModel.aggregate([
            {
              $sort: { score: -1 } // Sort the documents by the "score" field in descending order
            },
            {
              $setWindowFields: {
                sortBy: { score: -1 },
                output: {
                  rank: { $rank: {} }
                }
              }
            },
            {
              $project: {
                token:0
                // Include other fields here
              }
            }
          ]);
          
          
          
          
          
          
          return res.status(200).json({status:true,data:users});

    }
    catch(e){
        console.log(e)
        return res.status(500).json({status:false,error:"Server Error...."})
    }
})

module.exports=router;