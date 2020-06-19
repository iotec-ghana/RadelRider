import io from "socket.io-client/dist/socket.io";
import { PV_API } from "./constants";
import { Alert } from "react-native";
export const socket = io(PV_API, {
  secure: true,
  //timeout: 10000,
  // jsonp: false,
  transports: [`websocket`],
  // autoConnect: true,
  // agent: `-`,
  // path: `/`, // Whatever yr path is, obvs
  // pfx: `-`,
  // key: token, // Using token-based auth? Try passing it here.
  // passphrase: cookie, // Using cookie auth? Try passing it here.
  // cert: `-`,
  // ca: `-`,
  // ciphers: `-`,
  // rejectUnauthorized: `-`,
  // perMessageDeflate: `-`,
});
export function establishConnectionToSocket(riderData) {
  socket.emit("new-rider", riderData);
}

export function broadCastLocationChange(riderData) {
  socket.emit("rider-movement", riderData);
}

export function disconnect(data) {
  //socket.disconnect()
   socket.emit("disconnect",data)
}

export function makeDecision(decisionObj) {
  socket.emit("request-decision", decisionObj);
  //console.log("Responded")
}
export function tracking(trackingData) {
  socket.emit("track-rider", trackingData);
}
  