import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import ContextMain from "./ContextMain";
import { io } from "socket.io-client";
import { SERVER_URL, getRequest } from "../server/server";

export default function ContextRouter(props) {
  const [getUser, setUser] = useState({ isLogin: false, "name": "", "emailid": "", score: 0,match:0 })
  const [gameMode, setGameMode] = useState(1);
  const [getDifficulty, setDifficulty] = useState(1)
  const [getSocket, setSocket] = useState(null);
  const [getMsg,setMsg]=useState("Waiting for opponent...")
  const [gameId, setGameId] = useState("");
  const [yourMove, setYourMove] = useState(0);
  const [opponentMove, setOpponentMove] = useState(0);
  const [symbol, setSymbol] = useState({ your: "X", opponent: "O" })
  const [getCurrentTurn, setCurrentTurn] = useState(1);
  const [getOpen,setOpen]=useState({status:false,title:"",component:<></>,code:false})
  const history = useHistory()
  useEffect(() => {
    if (getUser.isLogin && getSocket === null) {
      const socket = io(SERVER_URL);
      setSocket(socket)
      socket.on("playerFind", (game_id,sy,turn) => {
        let op="X";
        if(sy=="X"){
          op='O';
        }
        setCurrentTurn(turn);
        setGameId(game_id);
        setSymbol({your:sy,opponent:op});
        setMsg("Opponent Found...")
        setTimeout(()=>{
          history.replace({ pathname: "/play" });
          setOpen({status:false})
        },3000)
      })

      socket.on("moveOpponent", (game_id, move) => {
        if(move==-1){
            move=opponentMove;
        }
          setOpponentMove(move);
      })

      socket.on("opponentDisconnect",(game_id)=>{
          alert("Opponent Disconnect....")
          Reset()
          history.replace({pathname:"/"})
      })
      socket.emit("connectUser",getUser.name,getUser.emailid);
    }
  }, [getUser])

  const Reset=()=>{
      setOpponentMove(0)
      setYourMove(0)
      setCurrentTurn(1)
      setGameId("")
  }

  const updateScore=async(score)=>{
      try{
          let res=await getRequest(`/score/${score}`)
          if(res.status){
              alert("Score Updated...")
          }
          else{
            alert(res.error)
          }
      }
      catch(e){
          alert("Server Error...")
      }
  }

  const fetchUser=async()=>{
    try{
        let res=await getRequest("/")
        if(res.status){
            setUser({isLogin:true,data:res.data});
        }
        else{
          console.log(res.error);
        }
    }
    catch(e){ 
        alert("Server Error....");
        history.replace({pathname:"/"})
    }

  }

  useEffect(()=>{
      fetchUser()
  },[])

  return (
    <ContextMain.Provider value={{setUser,fetchUser,updateScore,setMsg,getMsg,getOpen,setOpen,setGameId,Reset,getCurrentTurn,setCurrentTurn,getSocket,gameId, yourMove,setYourMove,opponentMove,setOpponentMove,setSymbol,symbol,getUser, gameMode, setGameMode, getDifficulty, setDifficulty }}>
      {props.children}
    </ContextMain.Provider>
  )
}
