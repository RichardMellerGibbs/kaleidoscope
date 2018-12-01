import axios from 'axios';

import { GET_CHECKINOUT, CHECKINOUT_LOADING, GET_ERRORS } from './types';

// "proxyCheckIn": "https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev",

//Get checkinout
export const getCheckInOut = () => dispatch => {
  dispatch(setCheckInOutLoading());
  axios
    .all([
      axios.get(
        'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
      ),
      axios.get(
        'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
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

// export const getCheckInOut = () => dispatch => {
//   dispatch(setCheckInOutLoading());
//   axios
//     .get(
//       'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
//     )
//     .then(res =>
//       dispatch({
//         type: GET_CHECKINOUT,
//         payload: res.data
//       })
//     )
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: {}
//       })
//     );
// };

//CheckInOut loading
export const setCheckInOutLoading = () => {
  return {
    type: CHECKINOUT_LOADING
  };
};
