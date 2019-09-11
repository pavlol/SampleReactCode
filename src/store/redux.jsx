import {
  applyMiddleware,
  createStore,
} from 'redux';
import promise from 'redux-promise';
import reducers from '../reducers/index';
import Async from '../middleware/async';   //custom middleware
import reduxThunk from 'redux-thunk';
import {AUTH_USER} from '../actions/types';

const createStoreWithMiddleware = applyMiddleware(promise, Async, reduxThunk)(createStore)
export const store = createStoreWithMiddleware(reducers,
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const token = localStorage.getItem("token");
const accessLevel = localStorage.getItem("accessLevel");
const name = localStorage.getItem("name");
const userData = {accessLevel, name}
if(token && accessLevel && name){
  store.dispatch({type:AUTH_USER, payload:userData});
}

store.subscribe(()=>{
    console.log("store changed", store.getState());
});
