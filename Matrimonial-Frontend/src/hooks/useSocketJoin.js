import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../socket";

export const useSocketJoin =()=>{
    useEffect(()=>{
        const myUserId =localStorage.getItem("userId");
        if(myUserId){
            console.log("🔌 Joining socket room:", myUserId);
            socket.emit("join",myUserId);
        }
    },[]);
}