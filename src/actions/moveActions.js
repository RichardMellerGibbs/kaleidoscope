import axios from "axios";

import {
  GET_USERS_AND_TASKS_LOADING,
  GET_GENERIC_TASKS,
  //PUT_MOVE_TASK,
  GET_ERRORS
} from "./types";

//Get active users and generic tasks
export const getUsersAndGenericTasks = tokenStr => dispatch => {
  dispatch(setGetUsersAndTasksLoading());
  axios
    .all([
      axios.get(
        "https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/prod?postId=*"
        //   {
        //     headers: {
        //       Authorization: `Bearer ${tokenStr}`
        //     }
        //   }
      ),
      axios.get(
        "https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod?spoolId=*"
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
      "https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/prod",
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
      "https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/prod",
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
      "https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/prod",
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
