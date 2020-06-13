import { COME_ONLINE, GO_OFFLINE, GET_ONLINE_STATUS } from "./types";
import {AsyncStorage} from 'react-native';
import * as Location from "expo-location";
const taskName = "rider-background-location";
export const Online = (isonline) => async (dispatch) => {
  
  try {
   
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(taskName, {
        accuracy: Location.Accuracy.Balanced,
      })
     
    }
    
    await AsyncStorage.setItem(
      "onlineStatus",
      JSON.stringify({ online: true }) 
    );
   
    dispatch({
      type: COME_ONLINE,
      payload: isonline,
    });
  } catch (e) {
      console.log(e.message)
  }
};

export const Offline = (isonline) => async (dispatch) => {
  try {
      
    await AsyncStorage.setItem(
      "onlineStatus",
      JSON.stringify({ online: false })
    );
    await Location.stopLocationUpdatesAsync(taskName);
    console.log("off complete 1");
    dispatch({
      type: GO_OFFLINE,
      payload: isonline,
    });
  } catch (e) {}
};
export const GetOnlineStatus = () => async (dispatch) => {
  try {
    const read = await AsyncStorage.getItem("onlineStatus");
    const status = JSON.parse(read);
    dispatch({
      type: GET_ONLINE_STATUS,
      payload: status.online,
    });
  } catch (e) {}
};
