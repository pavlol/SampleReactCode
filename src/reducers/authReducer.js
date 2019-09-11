import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from '../actions/types';

export default function(state={}, action){
  switch(action.type){
    case AUTH_USER:
    console.log("action.payload", action.payload);
      return {...state, 
      error:"", 
      authenticated:true, 
      accessLevel: action.payload.accessLevel, 
      name: action.payload.name};
    case UNAUTH_USER:
      return {...state, authenticated:false, accessLevel: null};
    case AUTH_ERROR:
    //return {...state, error:action.payload.response.data.error};
      return {...state, error:action.payload};
    case FETCH_MESSAGE:
      return {...state, message: action.payload};
    default:
    return {...state};
  }
}
