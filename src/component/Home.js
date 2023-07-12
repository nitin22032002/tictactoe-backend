import React, { useContext, useState } from 'react'
import "../css/home.css"
import {useHistory} from "react-router-dom"
import ContextMain from '../context/ContextMain'
import Waiting from './Waiting'
import Login from "./Login"
export default function Home() {
    const history=useHistory()
    const context=useContext(ContextMain)
    const handleClick=()=>{
        context.Reset()
        if(context.gameMode===1){
            context.setGameId("game1")
            history.replace({pathname:context.getUser.isLogin?"/play":"/login"})
        }
        else{
            if(context.getSocket){
                context.setOpen({status:true,title:"Find Opponent",component:<Waiting/>,code:true})
                context.getSocket.emit("findOpponent");
            }
            else{
                context.setOpen({status:true,title:"Login/Signup",component:<Login/>,code:false})
            }
        }
    }
  return (
    <div className='home-div'>
        <div className='home-sub-div'>
            <div className='home-heading'>
                Welcome Back !
            </div>
            <div className='home-options'>
                <div className='play-option'>
                    <div onClick={()=>{context.setGameMode(1)}} className={`option-1 ${context.gameMode===1?"option-active":""}`}>
                        Human To Computer
                    </div>
                    <div onClick={()=>{context.setGameMode(2)}} className={`option-1 ${context.gameMode===2?"option-active":""}`}>
                        Human To Human
                    </div>
                </div>
                <div className='play-option'>
                    <div onClick={()=>{context.setDifficulty(1)}} className={`option-1 ${context.getDifficulty===1?"option-active":""}`}>
                        Easy
                    </div>
                    <div onClick={()=>{context.setDifficulty(2)}} className={`option-1 ${context.getDifficulty===2?"option-active":""}`}>
                        Medium
                    </div>
                    <div onClick={()=>{context.setDifficulty(3)}} className={`option-1 ${context.getDifficulty===3?"option-active":""}`}>
                        Hard
                    </div>
                </div>
                <div className='play-btn'>
                    <button onClick={()=>{handleClick()}}>Play</button>
                </div>
            </div>
        </div>
    </div>
  )
}
