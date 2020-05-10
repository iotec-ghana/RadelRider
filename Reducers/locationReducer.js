import {GET_CURRENT_LOCATION, GET_DESTINATION_LOCATION} from '../Actions/types';

const initialState = {
  OriginCoordinates: {
    latitude: 0.009,
    longitude: 0.009,
  },
  DestinationCoordinates: {
    latitude: 0.009,
    longitude: 0.009,
  },
  originName: '',
  destinationName: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_LOCATION:
      //console.log(action.payload);
      return {
        ...state,
        OriginCoordinates: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        },
        originName: action.payload.originName,

        //error: action.error,
      };
    case GET_DESTINATION_LOCATION:
      return {
        ...state,
        DestinationCoordinates: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        },
        destinationName: action.payload.destinationName,
        // error: action.error,
      };

    default:
      return state;
  }
}
