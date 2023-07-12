const express=require("express");
const app=express()
const http=require("http");
const server=http.createServer(app)
const uuid=require("uuid")
const socket=require("socket.io")
const io=socket(server,{cors:{origin:"*"}});
const cors=require("cors")
const dotenv=require("dotenv")
const db=require("./db")
dotenv.config({path:"./.env"})
app.use(express.json());
app.use(cors());
db()
const PORT=process.env.PORT || 5000;

const playStack=new Map()

const waitingStack=[]

const userStack=new Map()

io.on('connection', (socket) => {
    console.log('A client connected....');
  
    socket.on("connectUser",(name,emailid)=>{
        userStack.set(socket,{"name":name,"emailid":emailid})
    })
  
    socket.on("findOpponent",()=>{
        if(waitingStack.length===0){
            waitingStack.push(socket);
        }
        else{
            let game_id=`TicTacToe${playStack.size}`
            playStack.set(game_id,[socket,waitingStack.pop()])
            let sy="X";
            let x=Math.random() < 0.5 ? 0 : 1
            for(let player of playStack.get(game_id)){
                player.emit("playerFind",game_id,sy,x);
                sy="O";
                x=1-x;
            } 
        }
    })

    socket.on("timeout",()=>{
        waitingStack.pop();
    })

    socket.on("move",(game_id,move)=>{
        if(playStack.has(game_id)){
            for(let player of playStack.get(game_id)){
                if(player===socket){continue}
                player.emit("moveOpponent",game_id,move);
            }
        } 
    })
    socket.on("gameEnd",(game_id)=>{
        if(playStack.has(game_id)){
            playStack.delete(game_id);
        }
    })
  
  socket.on('restart', (game_id) => {
      console.log('A client Restart',game_id);
      if(waitingStack.length!==0 && waitingStack[0]==socket){
          waitingStack.pop()
        
      }
      else{
        if(playStack.has(game_id)){
            for(let player of playStack.get(game_id)){
                if(player===socket){continue}
                player.emit("opponentDisconnect",game_id);
            }
        } 
        
      }
    });

    socket.on('disconnect', () => {
      console.log('A client disconnected.');
      if(waitingStack.length!==0 && waitingStack[0]==socket){
          waitingStack.pop()
        
      }
      else{
        
        for(let game_id of Object.keys(playStack)){
            if(playStack.get(game_id).includes(socket)){
                if(playStack.get(game_id)[0]!=socket){
                    playStack.get(game_id)[0].emit("opponentDisconnect",game_id);
                }
                else{
                    playStack.get(game_id)[1].emit("opponentDisconnect",game_id);
                }
                playStack.delete(game_id);
                break;
            }
        }
        
      }
    });
  });

app.use("/*",(req,res,next)=>{
    console.log(req.originalUrl);
    next();
})

app.use("/",require("./routers"))

app.get("/*",(req,res,next)=>{
    console.log("here")
    res.status(200).json({"status":true});
})

server.listen(PORT,()=>{
    console.log("Server Lisen At Port "+PORT);
})
