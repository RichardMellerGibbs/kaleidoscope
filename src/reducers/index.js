import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errroReducer from "./errorReducer";
import checkInOutReducer from "./checkInOutReducer";
import workerTaskReducer from "./workerTaskReducer";
import moveTasksReducer from "./moveTasksReducer";

export default combineReducers({
  auth: authReducer,
  errors: errroReducer,
  checkInOut: checkInOutReducer,
  workerTask: workerTaskReducer,
  genericSpools: workerTaskReducer,
  moveTasks: moveTasksReducer
});
