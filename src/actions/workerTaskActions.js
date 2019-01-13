import axios from 'axios';

import {
  GET_ERRORS,
  GET_ACTIVE_USERS,
  ACTIVE_USER_LOADING,
  GET_GENERIC_SPOOLS,
  GENERIC_SPOOL_LOADING,
  PUT_MOVESPOOL
} from './types';

//Get active users
export const getActiveUsers = tokenStr => dispatch => {
  dispatch(setActiveUserLoading());
  axios
    .get(
      'https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/prod?postId=*'
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
      'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod?spoolId=*'
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
      'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod',
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
      'https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/prod',
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
      'https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/prod',
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
