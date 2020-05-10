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
  socket.on("listening-for-requests", (userRequest) => {
    console.log(userRequest)
    Alert.alert(
      "You got a passenger",
      `pickup: ${userRequest.pickup}\nDropoff:${userRequest.destination}`,
      [
        {  
          text: "Decline",
          onPress: () =>
            makeDecision({
              ...userRequest,
              isAvailable: false,
            }),
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () =>
            makeDecision({
              ...userRequest,
              isAvailable: true,
            }),
           // tracking()
        }, 
      ],
      { cancelable: false }  
    );
  });  
        
}  
    
export function makeDecision(decisionObj) {
  socket.emit("request-decision", decisionObj);
}
export function tracking(trackingData) {
  socket.emit("track-rider", trackingData);
}
  