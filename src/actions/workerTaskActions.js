import axios from 'axios';

import {
  GET_ERRORS,
  GET_ACTIVE_USERS,
  ACTIVE_USER_LOADING,
  GET_GENERIC_SPOOLS,
  GENERIC_SPOOL_LOADING,
  PUT_MOVESPOOL
} from './types';

//Prod Versions
let getActiveUsersUrl =
  'https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/prod?postId=*';
let getGenericSpoolsUrl =
  'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod?spoolId=*';
let moveSpoolUrl =
  'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod';
let moveSpoolToUserUrl =
  'https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/prod';
let moveFromUserSpoolUrl =
  'https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/prod';

if (process.env.REACT_APP_ENV === 'dev') {
  getActiveUsersUrl =
    'https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/dev?postId=*';
  getGenericSpoolsUrl =
    'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/dev?spoolId=*';
  moveSpoolUrl = 'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/dev';
  moveSpoolToUserUrl =
    'https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/dev';
  moveFromUserSpoolUrl =
    'https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/dev';
}

//Get active users
export const getActiveUsers = tokenStr => dispatch => {
  dispatch(setActiveUserLoading());
  axios
    .get(
      getActiveUsersUrl
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: GET_ACTIVE_USERS,
        payload: { res }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Get Generic spools
export const getGenericSpools = tokenStr => dispatch => {
  dispatch(setGenericSpoolLoading());
  axios
    .get(
      getGenericSpoolsUrl
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: GET_GENERIC_SPOOLS,
        payload: { res }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Put checkin
export const moveSpool = (taskMove, tokenStr) => dispatch => {
  axios
    .post(
      moveSpoolUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: PUT_MOVESPOOL,
        payload: { res }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Put checkin
export const moveToUserSpool = (taskMove, tokenStr) => dispatch => {
  axios
    .post(
      moveSpoolToUserUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: PUT_MOVESPOOL,
        payload: { res }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Put checkin
export const moveFromUserSpool = (taskMove, tokenStr) => dispatch => {
  axios
    .post(
      moveFromUserSpoolUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: PUT_MOVESPOOL,
        payload: { res }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//ActiveUser loading
export const setActiveUserLoading = () => {
  return {
    type: ACTIVE_USER_LOADING
  };
};

//GenericSpool loading
export const setGenericSpoolLoading = () => {
  return {
    type: GENERIC_SPOOL_LOADING
  };
};
