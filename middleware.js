const jwt=require("jsonwebtoken");
const userModel=require("./userModel");

const generateToken=(data)=>{
    try{
        let token=jwt.sign(data,process.env.JWT_STRING);
        return token;
    }
    catch(e){
        return null;
    }
}

const verifyToken=async(req,res,next)=>{
    try{
        let {token}=req.headers;
        if(token){
            let data=jwt.verify(token,process.env.JWT_STRING);
            if(data){
                if(jwt.decode(data.token)){
                    let user_id=data._id;
                    let user=await userModel.findById(user_id);
                    if(user.token==token){
                        req['body']['user_id']=user._id;
                        next();
                    }
                    else{
                        throw("Invalid user.. 1")
                    }
                }
                else{
                    throw("Invalid user.. 2")
                }
            }
            else{
                throw("Invalid user.. 3")
            }
        }
        else{
            throw("Invalid User.. 4")
        }
    }
    catch(e){
        console.log(e)
        return res.status(401).json({status:false,error:"session expire"})
    }
}

module.exports={verifyToken,generateToken};