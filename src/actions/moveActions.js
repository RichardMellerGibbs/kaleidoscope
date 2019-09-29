import axios from 'axios';

import {
  GET_USERS_AND_TASKS_LOADING,
  GET_GENERIC_TASKS,
  //PUT_MOVE_TASK,
  GET_ERRORS
} from './types';

// Prod versions
let getUsersUrl =
  'https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/prod?postId=*';
let getTasksUrl =
  'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod?spoolId=*';
let moveGenericTaskUrl =
  'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod';
let moveToUserTasksUrl =
  'https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/prod';
let moveFromUserTaskUrl =
  'https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/prod';

if (process.env.REACT_APP_ENV === 'dev') {
  getUsersUrl =
    'https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/dev?postId=*';
  getTasksUrl =
    'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/dev?spoolId=*';
  moveGenericTaskUrl =
    'https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/dev';
  moveToUserTasksUrl =
    'https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/dev';
  moveFromUserTaskUrl =
    'https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/dev';
}

//Get active users and generic tasks
export const getUsersAndGenericTasks = tokenStr => dispatch => {
  dispatch(setGetUsersAndTasksLoading());
  axios
    .all([
      axios.get(
        getUsersUrl
        //   {
        //     headers: {
        //       Authorization: `Bearer ${tokenStr}`
        //     }
        //   }
      ),
      axios.get(
        getTasksUrl
        //   {
        //     headers: {
        //       Authorization: `Bearer ${tokenStr}`
        //     }
        //   }
      )
    ])
    .then(
      axios.spread((activeUsers, genericTasks) => {
        dispatch({
          type: GET_GENERIC_TASKS,
          payload: {
            activeUsers: activeUsers,
            genericTasks: genericTasks
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

//Move generic spool to generic spool
export const moveGenericTask = (
  taskMove,
  tokenStr,
  moveInstruction
) => dispatch => {
  axios
    .post(
      moveGenericTaskUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

export const moveToUserTask = (
  taskMove,
  tokenStr,
  moveInstruction
) => dispatch => {
  //dispatch(setPuttingTask());
  axios
    .post(
      moveToUserTasksUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//Put checkin
export const moveFromUserTask = (
  taskMove,
  tokenStr,
  moveInstruction
) => dispatch => {
  axios
    .post(
      moveFromUserTaskUrl,
      taskMove //,
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokenStr}`
      //   }
      // }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

//CheckInOut loading
export const setGetUsersAndTasksLoading = () => {
  return {
    type: GET_USERS_AND_TASKS_LOADING
  };
};
