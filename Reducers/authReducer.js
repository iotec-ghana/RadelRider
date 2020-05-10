import {
  AUTHENTICATION_STATUS,
  SIGN_IN,
  SIGN_OUT,
  REGISTER,
  CHECK_LOGIN_STATUS,
} from '../Actions/types';

const initialState = {
  error2: '',
  error: '',
  isAuthenticated: false,
  user: null,
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        error: action.error,
        user: action.payload.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        token: '',
      };

    case REGISTER:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        error2: action.error2,
        user: action.payload.user,
      };
    case CHECK_LOGIN_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    default:
      // console.log(state);

      return state;
  }
}
