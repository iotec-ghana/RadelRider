import {SELECTED_RIDER} from '../Actions/types';

const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case SELECTED_RIDER:
      //console.log("yes"+JSON.stringify(action.payload))
      return {
        ...state,
        riderDetails: action.payload,
      };

    default:
      return state;
  }
}
