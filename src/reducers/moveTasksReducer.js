import {
  GET_GENERIC_TASKS,
  GET_USERS_AND_TASKS_LOADING
} from "../actions/types";

const initialState = {
  activeUsers: [],
  genericTasks: {},
  loading: false,
  putting: false,
  moveInstruction: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_AND_TASKS_LOADING:
      return {
        ...state,
        loading: true,
        moveInstruction: {}
      };
    case GET_GENERIC_TASKS:
      const newState = prepData(action.payload.genericTasks.data);
      return {
        ...state,
        loading: false,
        genericTasks: newState,
        activeUsers: action.payload.activeUsers.data,
        moveInstruction: {}
      };
    default:
      return state;
  }
}

const prepData = payload => {
  let tasks = {};
  let columns = {};
  let columnOrder = [];

  payload.forEach(column => {
    column.spools.forEach(spool => {
      tasks[spool.spoolRef] = {
        id: spool.spoolRef,
        status: spool.Status,
        startDate: spool.StartDate,
        spoolName: spool.spoolName
      };
    });
  });

  payload.forEach(column => {
    columns[column.locationId] = {
      id: column.locationId,
      title: column.locationName,
      taskIds: column.spools.map(spool => {
        return spool.spoolRef;
      })
    };

    columnOrder.push(column.locationId);
  });

  const initialTaskState = {
    tasks,
    columns,
    columnOrder
  };

  return initialTaskState;
};
