import { combineReducers } from 'redux';
import { reducer as form } from "redux-form";
import comments  from './commentsReducer';
import auth from './authReducer';
import items from './itemsReducer';
import blog from './blogReducer';
import branch from './branchReducer';
import calendar from './calendarReducer';
import customers from './customersReducer';
import error from './errorReducer';
import map from './mapReducer';

const rootReducer = combineReducers({
  comments,
  form,
  auth,
  items,
  blog, 
  branch,
  calendar,
  customers,
  error,
  map
});

export default rootReducer;
