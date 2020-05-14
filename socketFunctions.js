import io from "socket.io-client";
import { PV_API } from "./constants";
import { Alert } from "react-native";
const socket = io(PV_API, {
  secure: true,
  transports: ["websocket"], 
});
export function establishConnectionToSocket(riderData) {
  socket.emit("new-rider", riderData);
}        
                        
export function ListenForRideRequest() {
  
          
}   
export function disconnect(data){ 
  socket.emit("disconnect",data)
 // socket.emit("disconnect",data)
 
}
  
export function makeDecision(decisionObj) {
  socket.emit("request-decision", decisionObj);
  console.log("Responded")
}
export function tracking(trackingData) {
  socket.emit("track-rider", trackingData);
}
  