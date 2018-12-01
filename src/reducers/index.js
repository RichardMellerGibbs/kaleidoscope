import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errroReducer from './errorReducer';
import checkInOutReducer from './checkInOutReducer';

export default combineReducers({
  auth: authReducer,
  errors: errroReducer,
  checkInOut: checkInOutReducer
});
