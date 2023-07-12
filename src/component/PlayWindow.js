import React, { useContext, useEffect, useState } from 'react'
import ContextMain from "../context/ContextMain"
import "../css/playwindow.css"
import { useHistory } from "react-router-dom";
import { useRef } from 'react';
import { TicTacToe } from './TicTacToe';
export default function PlayWindow() {
  const difficulty = ["Easy", "Medium", "Hard"]
  const [getTimeInterval, setTimeInterval] = useState(null);
  const [getMove, setMove] = useState(9)
  const [getTicTacToeObj, setTicTacToeObj] = useState(null);
  const [getMatch, setMatch] = useState({ winner: 0, value: [] })
  const [gameOver, setGameOver] = useState(false);
  const context = useContext(ContextMain)
  const history = useHistory()
  const timeRef = useRef()
  if(context.gameId===""){
      history.replace({pathname:"/"})
  }
  useEffect(() => {
    if (gameOver) {
      setTimeout(()=>{
        history.replace({ pathname: "/" })
      },5000)  
      context.getSocket.emit("gameEnd", context.gameId)
      context.updateScore(getMatch.winner);
      context.Reset()
    }
  }, [gameOver])
  
  useEffect(() => {
    let obj = new TicTacToe(context.getDifficulty, -1);
    setTicTacToeObj(obj);
    console.log("Object Created......")
  }, [context.getDifficulty])

  useEffect(() => {
    handleTurnChange()
    if (!gameOver) {
      updateTimer()
    }
  }, [context.getCurrentTurn])

  useEffect(() => {
    if ((context.yourMove !== 0 || context.opponentMove !== 0) && getTicTacToeObj!==null) {
      checkWinner()
    }
  }, [context.yourMove, context.opponentMove])

  const updateTimer = () => {
    if (getTimeInterval) {
      clearInterval(getTimeInterval);
    }
    let timer;
    if(context.gameMode===1){
      timer = parseInt(60 / context.getDifficulty);
    }
    else{
      timer=60;
    }
    let timeInterval = setInterval(() => {
      timer -= 1;
      if (timeRef.current) {
        timeRef.current.innerHTML = `${timer} sec left`;
        if (timer <= 5) {
          timeRef.current.style.color = "red"
        }
        else {
          timeRef.current.style.color = "rgb(16, 16, 221)"
        }
      }
      if (timer === 0) { 
        context.setCurrentTurn(1 - context.getCurrentTurn);
        clearInterval(timeInterval);
        if (getMove - 1 == 0) {
          setGameOver(true);
          alert("Game Draw..")
        }
        setMove(getMove - 1);
      }
    }, 1000)
    setTimeInterval(timeInterval);
  }
  const handleTurnChange = () => {
    if (context.getCurrentTurn === 0 && context.gameMode === 1) {
      setTimeout(() => {
        handleOpponentMove();
      }, 1000)
    }
  }
  const checkWinner = () => {
    setMove(getMove - 1);
    let out = getTicTacToeObj.WhoWin(context.yourMove, context.opponentMove);
    let status = out[0];
    let value = out[1];
    if (status == 1) {
      setMatch({ winner: 1, value })
      clearInterval(getTimeInterval)
      alert("You Win The Match");
      setGameOver(true)
    }
    else if (status == -1) {
      setMatch({ winner: -1, value })
      clearInterval(getTimeInterval)
      alert("You Loose The Match")
      setGameOver(true)
    }
    else if (getMove - 1 === 0) {
      clearInterval(getTimeInterval)
      alert("Match Draw");
      setGameOver(true)
    }
    else {
      context.setCurrentTurn(1 - context.getCurrentTurn);
    }
  }
  const handleOpponentMove = () => {
    let opponentBit = getTicTacToeObj.findMove(context.yourMove, context.opponentMove, getMove);
    context.setOpponentMove(opponentBit);
  }
  const handleClick = (bit) => {
    let yourBit = context.yourMove;
    if ((context.yourMove >> bit) & 1 == 1 || (context.opponentMove >> bit) & 1 == 1 || getMove === 0 || context.getCurrentTurn === 0) {
      alert("Illegal Move")
      return
    }
    yourBit |= (1 << bit);
    context.setYourMove(yourBit)
    context.getSocket.emit("move", context.gameId, yourBit);
  }
  return (
    <div className='playwindow-div'>
      <div className='playwindow-sub-div'>
        <div className='play-header'>
          <div className='player-info'>
            {context.gameMode===1?"You Vs Computer":"You Vs Human"}
          </div>
          <div className='play-timer'>
            Timer : <span ref={timeRef}></span>
          </div>
          {context.gameMode===1 && <div className='play-level'>
            Level : {difficulty[context.getDifficulty - 1]}
          </div>}
          <div className='play-move-left'>
            Move Left : {getMove}
          </div>
          <div className='play-move-left'>
            <button onClick={()=>{context.getSocket.emit("restart",context.gameId);history.replace({pathname:"/"})}}>Quit</button>
          </div>
        </div>
        <div className='play-main'>
          <div className='play-row'>
            <div onClick={() => { handleClick(0) }} style={{ backgroundColor: getMatch.value.includes(0) ? getMatch.winner===1?"green":"red" : "" }} className='play-col1'>
              {(context.yourMove >> 0) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 0) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(1) }} style={{ backgroundColor: getMatch.value.includes(1) ? getMatch.winner===1?"green":"red" : "" }} className='play-col2'>
              {(context.yourMove >> 1) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 1) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(2) }} style={{ backgroundColor: getMatch.value.includes(2) ? getMatch.winner===1?"green":"red" : "" }} className='play-col3'>
              {(context.yourMove >> 2) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 2) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
          </div>
          <div className='play-row'>
            <div onClick={() => { handleClick(3) }} style={{ backgroundColor: getMatch.value.includes(3) ? getMatch.winner===1?"green":"red" : "" }} className='play-col1'>
              {(context.yourMove >> 3) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 3) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(4) }} style={{ backgroundColor: getMatch.value.includes(4) ? getMatch.winner===1?"green":"red" : "" }} className='play-col2'>
              {(context.yourMove >> 4) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 4) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(5) }} style={{ backgroundColor: getMatch.value.includes(5) ? getMatch.winner===1?"green":"red" : "" }} className='play-col3'>
              {(context.yourMove >> 5) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 5) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
          </div>
          <div className='play-row'>
            <div onClick={() => { handleClick(6) }} style={{ backgroundColor: getMatch.value.includes(6) ? getMatch.winner===1?"green":"red" : "" }} className='play-col-last-1'>
              {(context.yourMove >> 6) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 6) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(7) }} style={{ backgroundColor: getMatch.value.includes(7) ? getMatch.winner===1?"green":"red" : "" }} className='play-col-last-1'>
              {(context.yourMove >> 7) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 7) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
            <div onClick={() => { handleClick(8) }} style={{ backgroundColor: getMatch.value.includes(8) ? getMatch.winner===1?"green":"red" : "" }} className='play-col-last-2'>
              {(context.yourMove >> 8) & 1 == 1 ? context.symbol.your : (context.opponentMove >> 8) & 1 == 1 ? context.symbol.opponent : ""}
            </div>
          </div>
        </div>
        <div className='play-footer'>
          waiting for {context.getCurrentTurn == 1 ? "You" : "Opponent"}.....
        </div>
      </div>
    </div>
  )
}
