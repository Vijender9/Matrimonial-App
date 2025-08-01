import express from "express"
import dotenv from"dotenv"
import cors from"cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/index.js"
import http from "http"
import { Server } from "socket.io"



dotenv.config();
console.log("MONGO URI:",process.env.MONGODB_URI);
const app=express();
app.use(cors({

    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());



 import userRouter from "./routes/User.routes.js"
 import shortlistRouter from "./routes/Shortlist.routes.js"
 import messageRouter from "./routes/Message.routes.js"
 import adminRouter from"./routes/Admin.routes.js"
 import publicRouter from "./routes/Public.routes.js"

app.use("/api/users",userRouter)

app.use("/api/shortlists",shortlistRouter);
app.use("/api/admin",adminRouter)
app.use("/api/messages",messageRouter);
app.use("/api/public",publicRouter);



// wrapping app in http server
const server= http.createServer(app);

//socket.io setup

const io= new Server(server,{
    cors:{
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
});
export {io} // exporting globally

// socket events
io.on("connection", (socket)=>{
    console.log(" A user connected", socket.id);
 
    // join personal room

    socket.on("join",(userId)=>{
      console.log("joining room in backend with userid:",userId)
        socket.join(userId);
        console.log("User joined room:",userId);
        socket.userId=userId;
    });


     // 👇 Typing start
  socket.on("typing", ({ to }) => {
    io.to(to).emit("typing", { from: socket.userId });
  });


   // 👇 Typing stop
  socket.on("stop-typing", ({ to }) => {
    io.to(to).emit("stop-typing", { from: socket.userId });
  })
  
    // message sending
    socket.on("send-message",({to,message})=>{
      console.log("in backend socket sending message ")
      console.log("sending message from :",socket.userId," to :",to);
        io.to(to).emit("receive-message",message);
        console.log("sending message to(receiver) is:",to) // send to receiver
        io.to(socket.userId).emit("receive-message",message );// send to sender

    });


});


// start server after db connection
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });


// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT,()=>{
//         console.log(`Server is running one port${process.env.PORT}`)
//     })
    
// })
// .catch((err)=>{
//         console.log("Mongodb connection failed!")
//     })

    

