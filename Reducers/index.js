import { combineReducers } from "redux";
import authReducer from "./authReducer";
import locationReducer from "./locationReducer";
import getAllRidersReducer from "./getAllRidersReducer";
import SelectedRiderReducer from "./SelectedRiderReducer";
import OnlineStatusReducer from "./OnlineStatusReducer";
export default combineReducers({
  auth: authReducer,
  locationData: locationReducer,
  nearby_riders: getAllRidersReducer,
  selected_rider: SelectedRiderReducer,
  OnlineStatus: OnlineStatusReducer,
});
