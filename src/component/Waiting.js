import React, { useEffect, useState } from 'react';
import "../css/waiting.css"
import { useContext } from 'react';
import ContextMain from '../context/ContextMain';
const Waiting = () => {
  const [timer, setTimer] = useState(60);
  const context=useContext(ContextMain)

  useEffect(() => {
    if(timer==60){
      context.setMsg("Waiting for opponent...")
    }
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0 || context.getMsg!=="Waiting for opponent...") {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className="wait-container">
      <p className="wait-message">{context.getMsg}</p>
      <p className="wait-timer">Timer: {timer} seconds</p>
      {timer==0 && <button onClick={()=>{setTimer(60)}}>Retry</button>}
    </div>
  );
};

export default Waiting;
