import {SELECTED_RIDER} from './types';

export const getSelectedRider = data => {
  //console.log("mydaya"+data)
  return {
    type: SELECTED_RIDER,
    payload: data,
  };
};
