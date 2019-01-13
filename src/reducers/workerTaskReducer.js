import {
  GET_ACTIVE_USERS,
  ACTIVE_USER_LOADING,
  GET_GENERIC_SPOOLS,
  GENERIC_SPOOL_LOADING,
  PUT_MOVESPOOL
} from '../actions/types';

const initialState = {
  activeUsers: [],
  genericSpools: {},
  loading: false,
  spoolLoading: false,
  itemPut: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ACTIVE_USERS:
      return {
        ...state,
        loading: false,
        itemPut: false,
        activeUsers: action.payload.res.data
      };
    case ACTIVE_USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_GENERIC_SPOOLS:
      const newState = prepData(action.payload.res.data);
      return {
        ...state,
        spoolLoading: false,
        itemPut: false,
        genericSpools: newState
      };
    case GENERIC_SPOOL_LOADING:
      return {
        ...state,
        spoolLoading: true
      };
    case PUT_MOVESPOOL:
      return {
        ...state,
        itemPut: true
      };
    default:
      return state;
  }
}

const prepData = payload => {
  //console.log('workerTaskReducer reducer payload ', payload);

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

  // console.log('tasks = ', tasks);
  // console.log('columns = ', columns);
  // console.log('columnOrder = ', columnOrder);

  const initialTaskState = {
    tasks,
    columns,
    columnOrder
  };

  // console.log('initialTaskState ', initialTaskState);

  //this.setState({ workers: initialWorkers });
  //this.setState(initialTaskState);
  return initialTaskState;
};
