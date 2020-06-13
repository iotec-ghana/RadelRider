import { COME_ONLINE, GO_OFFLINE, GET_ONLINE_STATUS } from "../Actions/types";


const initialState = {
  online: false,
};

export default function(state = initialState, action) {
    console.log(action.payload,"gtom reducer")
  switch (action.type) {
    case COME_ONLINE:
       
      return {
        ...state,
        online: action.payload,
      };
    case GO_OFFLINE:
      return {
        ...state,
        online: action.payload,
      };
    case GET_ONLINE_STATUS:
      return {
        ...state,
        online: action.payload,
      };

    default:
      return state;
  }
}
