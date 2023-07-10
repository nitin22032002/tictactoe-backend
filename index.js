const express=require("express");
const app=express()
const http=require("http");
const server=http.createServer(app)
const uuid=require("uuid")
const socket=require("socket.io")
const io=socket(server,{cors:{origin:"*"}});
const cors=require("cors")
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT || 5000;

const playStack=new Map()

const waitingStack=[]

const userStack=new Map()

io.on('connection', (socket) => {
    console.log('A client connected....');  
    console.log(Object.keys(playStack))
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
            console.log(playStack.has(game_id))
            let sy="X";
            let x=Math.random() < 0.5 ? 0 : 1
            for(let player of playStack.get(game_id)){
                player.emit("playerFind",game_id,sy,x);
                sy="O";
                x=1-x;
            } 
        }
    })

    socket.on("timeOut",()=>{
        waitingStack.pop();
    })

    socket.on("move",(game_id,move)=>{
        // console.log(playStack.has(game_id))
        if(playStack.has(game_id)){
            for(let player of playStack.get(game_id)){
                if(player===socket){continue}
                // console.log(player)
                player.emit("moveOpponent",game_id,move);
            }
        } 
    })
    socket.on("gameEnd",(game_id)=>{
        if(playStack.has(game_id)){
            playStack.delete(game_id);
        }
    })

    socket.on('disconnect', () => {
      console.log('A client disconnected.');
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
    });
  });

app.get("/*",(req,res,next)=>{
    console.log("here")
    res.status(200).json({"status":true});
})

server.listen(PORT,()=>{
    console.log("Server Lisen At Port "+PORT);
})
