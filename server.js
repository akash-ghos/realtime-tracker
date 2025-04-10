const { log } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection",(socket)=> {

    console.log("new user connected");

    socket.on("send-location",(data)=>{

        io.emit("location",{id: socket.id, ...data})

    })

    socket.on("disconnect",()=>{
        io.emit("user-disconnected", socket.id)
        console.log("user-disconnected");
        
    })
    
})

app.get("/", (req,res)=>{

    res.render("index");
})

app.get("/test", (req,res)=>{

    res.send("hello akash");
})

server.listen(3001,()=>{

    console.log(`server listen on http://localhost:3001`);
})