import axios from 'axios';

import {
  GET_CHECKINOUT,
  PUT_CHECKINOUT,
  CHECKINOUT_LOADING,
  GET_ERRORS
} from './types';

// "proxyCheckIn": "https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev",

//Get checkinout
export const getCheckInOut = tokenStr => dispatch => {
  dispatch(setCheckInOutLoading());
  axios
    .all([
      axios.get(
        'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*',
        {
          headers: {
            Authorization: `Bearer ${tokenStr}`
          }
        }
      ),
      axios.get(
        'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*',
        {
          headers: {
            Authorization: `Bearer ${tokenStr}`
          }
        }
      )
    ])
    .then(
      axios.spread((checkInResponse, checkOutResponse) => {
        dispatch({
          type: GET_CHECKINOUT,
          payload: {
            checkInResponse: checkInResponse,
            checkOutResponse: checkOutResponse
          }
        });
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Put checkin
export const checkIn = (workerCheckIn, tokenStr) => dispatch => {
  axios
    .put(
      'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev',
      workerCheckIn //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: PUT_CHECKINOUT,
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

//Put checkOut
export const checkOut = (workerCheckOut, tokenStr) => dispatch => {
  axios
    .put(
      'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev',
      workerCheckOut //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .then(res => {
      dispatch({
        type: PUT_CHECKINOUT,
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

//CheckInOut loading
export const setCheckInOutLoading = () => {
  return {
    type: CHECKINOUT_LOADING
  };
};
