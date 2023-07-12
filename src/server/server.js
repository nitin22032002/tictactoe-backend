// const SERVER_URL="http://localhost:5000"
const SERVER_URL="https://tictactoe-backend.glitch.me"
const CLIENT_ID="494645546046-8tmr8u6uoi2cq74dksspn0lh11mkiepo.apps.googleusercontent.com"

const authenticationRequest=async(url,body)=>{
    try{
        let res=await fetch(`${SERVER_URL}${url}`,{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify(body)
        })
        res=await res.json();
        if(res.status){
            localStorage.setItem("user_auth",res.token);
            return null;
        }
        return res.error;
    }
    catch(e){
        console.log(e)
        return "Server Error....";
    }
}


const getRequest=async(url)=>{
    try{
        let res=await fetch(`${SERVER_URL}${url}`,{
            method:"GET",
            headers:{"content-type":"application/json",token:localStorage.getItem("user_auth")}
        })
        res=await res.json();
        return res;
    }
    catch(e){
        console.log("Server Error....")
        return {status:false,err:"Server Error..."}
    }
}



export {SERVER_URL,authenticationRequest,getRequest,CLIENT_ID};