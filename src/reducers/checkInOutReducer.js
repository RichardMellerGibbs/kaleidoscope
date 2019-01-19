import {
  GET_CHECKINOUT,
  PUT_CHECKINOUT,
  CHECKINOUT_LOADING
} from "../actions/types";
import sortTasks from "../common/sortTasks";

const initialState = {
  checkInOut: null,
  loading: false,
  itemPut: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHECKINOUT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CHECKINOUT:
      //console.log('GET_CHECKINOU reducer running');
      const newState = prepData(action.payload);
      return {
        ...state,
        checkInOut: newState,
        itemPut: false,
        loading: false
      };
    case PUT_CHECKINOUT:
      return {
        ...state,
        itemPut: true,
        loading: false
      };
    default:
      return state;
  }
}

const prepData = payload => {
  //console.log('payload.checkInResponse ', payload.checkInResponse.data);

  let checkedInData = payload.checkInResponse.data.map(worker => {
    worker.category = "checkedIn";
    return worker;
  });

  /************************************************/
  /* Extra employees here
  /************************************************/
  // testData.forEach(testEmployee => {
  //   checkedInData.push(testEmployee);
  // });

  /************************************************/
  /* Extra employees here
  /************************************************/

  //console.log('now ', checkedInData);

  let checkedOutWorkers = payload.checkOutResponse.data.map(worker => {
    worker.category = "checkedOut";
    return worker;
  });

  const initialWorkers = checkedInData.concat(checkedOutWorkers);
  // console.log(
  //   `checkedInData ${checkedInData.length} checkedOutWorkers ${
  //     checkedOutWorkers.length
  //   }`
  // );

  let tasks = {};

  initialWorkers.forEach((worker, index) => {
    tasks[worker.reference] = {
      id: worker.reference,
      surname: worker.WorkerName.WorkerSurname,
      title: worker.WorkerName.workerTitle,
      forename: worker.WorkerName.WorkerForename
    };
  });

  let checkInUnsortedTasks = [];
  initialWorkers.forEach(worker => {
    if (worker.category === "checkedIn") {
      checkInUnsortedTasks.push(worker.reference);
    }
  });

  const checkInTasks = sortTasks(checkInUnsortedTasks, tasks);

  //console.log('checkInTasks ', checkInTasks);

  let checkOutUnsortedTasks = [];
  initialWorkers.forEach(worker => {
    if (worker.category === "checkedOut")
      checkOutUnsortedTasks.push(worker.reference);
  });

  const checkOutTasks = sortTasks(checkOutUnsortedTasks, tasks);

  const initialTaskState = {
    tasks,
    columns: {
      checkedIn: {
        id: "checkedIn",
        title: "Checked In",
        taskIds: checkInTasks
      },
      checkedOut: {
        id: "checkedOut",
        title: "Checked Out",
        taskIds: checkOutTasks
      }
    },
    columnOrder: ["checkedOut", "checkedIn"]
  };

  // console.log('initialWorkers ', initialWorkers);
  // console.log('initialTasks ', tasks);
  // console.log('checkInTasks ', checkInTasks);
  // console.log('checkOutTasks ', checkOutTasks);
  // console.log('initialTaskState ', initialTaskState);

  //this.setState({ workers: initialWorkers });
  //this.setState(initialTaskState);
  return initialTaskState;
};
