import { Auth } from 'aws-amplify';

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  FORGOT_PASSWORD_SENT,
  PASSWORD_RESET,
  GET_CURRENT_USER_LOADING
} from './types';

// AWS Forgot password
export const forgotPassword = userData => dispatch => {
  Auth.forgotPassword(userData.email)
    .then(data => {
      dispatch({
        type: FORGOT_PASSWORD_SENT
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

// AWS Reset password
export const resetPassword = userData => dispatch => {
  Auth.forgotPasswordSubmit(userData.email, userData.code, userData.password)
    .then(data => {
      //console.log(data);
      dispatch({
        type: PASSWORD_RESET
      });
    })
    .catch(err => {
      //console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

//New Login AWS
export const loginUser = userData => dispatch => {
  Auth.signIn(userData.email, userData.password)
    .then(user => {
      dispatch(setCurrentUser(user));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

//Get logged in user
export const getCurrentUser = () => dispatch => {
  dispatch(getCurrentUserLoading());
  Auth.currentAuthenticatedUser()
    .then(user => {
      dispatch(setCurrentUser(user));
    })
    .catch(err => {
      dispatch(setCurrentUser({}));
    });
};

//Set logged in user
export const setCurrentUser = userData => {
  return {
    type: SET_CURRENT_USER,
    payload: userData
  };
};

export const logoutUser = history => dispatch => {
  Auth.signOut()
    .then(() => {
      // Set current user to {} which will set isAuthenticated to false
      dispatch(setCurrentUser({}));
    })
    .catch(() => {
      console.log('error signing out ');
    });
};

//GenericSpool loading
export const getCurrentUserLoading = () => {
  return {
    type: GET_CURRENT_USER_LOADING
  };
};
