import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  FORGOT_PASSWORD_SENT,
  PASSWORD_RESET
} from './types';

// Forgot password
export const forgotPassword = userData => dispatch => {
  axios
    .post('/api/forgot', userData)
    .then(res =>
      dispatch({
        type: FORGOT_PASSWORD_SENT
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Check forgot password reset token is valid
export const resetPassword = (userData, token) => dispatch => {
  axios
    .post('/api/reset/' + token, userData)
    .then(res =>
      dispatch({
        type: PASSWORD_RESET
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get user token
export const loginUser = userData => dispatch => {
  axios
    .post('route', userData)
    .then(res => {
      //Save to local storage
      const { token } = res.data;
      //Set token to localstorage
      localStorage.setItem('jwtToken', token);
      //Set token to auth header
      setAuthToken(token);
      // Do any decoding of the token here
      // Set current user
      dispatch(setCurrentUser(userData));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set logged in user
export const setCurrentUser = userData => {
  return {
    type: SET_CURRENT_USER,
    payload: userData
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  //Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
