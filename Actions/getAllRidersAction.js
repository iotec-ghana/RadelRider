import {GET_NEARBY_RIDERS, DELETE_DUPLICATE_RIDER_DETAILS} from './types';

export const getRiders = data => {
  return {
    type: GET_NEARBY_RIDERS,
    payload: data,
  };
};

export const DeleteDuplicate = payload => {
  return {
    type: DELETE_DUPLICATE_RIDER_DETAILS,
    payload: payload,
  };
};
