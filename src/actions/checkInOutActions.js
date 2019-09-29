import axios from 'axios';

import {
  GET_CHECKINOUT,
  PUT_CHECKINOUT,
  CHECKINOUT_LOADING,
  GET_ERRORS
} from './types';

//Prod versions
let checkedInUsersUrl =
  'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/prod?WorkerRef=*';
let checkedOutUsersUrl =
  'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/prod?WorkerRef=*';
let checkInUrl = 'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/prod';
let checkOutUrl = 'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/prod';

//Alows dev mode to use a different api version
//They are currently set to the same as the prod version above.
if (process.env.REACT_APP_ENV === 'dev') {
  checkedInUsersUrl =
    'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*';
  checkedOutUsersUrl =
    'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*';
  checkInUrl = 'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev';
  checkOutUrl = 'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev';
}

console.log(`checkedout url = ${checkedOutUsersUrl}`);

//Get checkinout
export const getCheckInOut = tokenStr => dispatch => {
  dispatch(setCheckInOutLoading());
  axios
    .all([
      axios.get(
        checkedInUsersUrl,
        //"https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*",
        {
          headers: {
            Authorization: `Bearer ${tokenStr}`
          }
        }
      ),
      axios.get(checkedOutUsersUrl, {
        headers: {
          Authorization: `Bearer ${tokenStr}`
        }
      })
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
      checkInUrl,
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
      checkOutUrl,
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
