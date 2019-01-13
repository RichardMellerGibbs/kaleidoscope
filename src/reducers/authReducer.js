import {
  SET_CURRENT_USER,
  FORGOT_PASSWORD_SENT,
  PASSWORD_RESET,
  GET_CURRENT_USER_LOADING
} from '../actions/types';
import isEmpty from '../validation/isEmpty';

const initialState = {
  isAuthenticated: false,
  forgotPasswordSent: false,
  passwordReset: false,
  authenticating: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        passwordReset: false,
        authenticating: false,
        user: action.payload
      };
    case FORGOT_PASSWORD_SENT:
      return {
        ...state,
        forgotPasswordSent: true
      };
    case PASSWORD_RESET:
      return {
        ...state,
        passwordReset: true,
        forgotPasswordSent: false //This was the last change to make reset redirect to login
      };
    case GET_CURRENT_USER_LOADING:
      return {
        ...state,
        authenticating: true
      };
    default:
      return state;
  }
}
