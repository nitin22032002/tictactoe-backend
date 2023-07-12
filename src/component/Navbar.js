import React, { useContext } from 'react'
import {useHistory} from "react-router-dom"
import ContextMain from '../context/ContextMain'
import "../css/navbar.css"
import Login from './Login'
import { getRequest } from '../server/server'
export default function Navbar() {
const history=useHistory()
const context=useContext(ContextMain)
const handleClick=async(path)=>{
    if(context.gameId){
        context.getSocket.emit("restart",context.gameId);
    }
    context.Reset();
    if(path==="/logout"){
        try{
            let res=await getRequest("/logout")
            if(res.status){
                localStorage.clear();
                context.setUser({isLogin:false});
            }
            else{
                alert(res.error);
            }
        }
        catch(e){
            alert("Server Error...")
        }
        path="/";
    }
    history.replace({pathname:path});
}
  return (
    <div className='navbar-div'>
        <div className='navbar-sub-div'>
            <div className='navbar-logo'>
                <span id="span-1">
                    Tic
                </span>
                <span id="span-2">
                    Tac
                </span>
                <span id="span-3">
                    Toe
                </span>
            </div>
            <div className='navbar-items'>
                <div className='navbar-item' onClick={()=>{handleClick("/")}}>
                    Home
                </div>
                {context.getUser.isLogin?
                <>
                <div className='navbar-item' onClick={()=>{handleClick("/leaderboard")}}>
                    Leaderboard
                </div>
                <div className='navbar-item' onClick={()=>{handleClick("/logout")}}>
                    Logout
                </div>
                </>
                :
                <div className='navbar-item' onClick={()=>{context.setOpen({status:true,title:"Login/Signup",component:<Login/>,code:false})}}>
                    Login/SignUp
                </div>}
            </div>
        </div>
    </div>
  )
}
