import { SET_CURRENT_USER } from '../actions/types';
import { FORGOT_PASSWORD_SENT } from '../actions/types';
import { PASSWORD_RESET } from '../actions/types';
import isEmpty from '../validation/isEmpty';

const initialState = {
  isAuthenticated: false,
  forgotPasswordSent: false,
  passwordReset: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
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
        passwordReset: true
      };
    default:
      return state;
  }
}
