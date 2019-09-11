import {CREATE_ITEM} from '../actions/types';


const defaultState ={currentView : [
]};
const commentsReducer = function(state = defaultState, action){
  switch(action.type){
    case CREATE_ITEM:
      console.log('action.payload',action.payload);
      const storeArr = state.currentView.slice(0);
      storeArr.push(action.payload);
      const newState = {...state, currentView : storeArr};
      return newState;
    default:
      return {...state};
  }
}

export default commentsReducer;
