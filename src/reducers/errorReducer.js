import _ from 'lodash';
import {
    NETWORK_ERROR,
    DEFAULT_ERROR,
    AUTH_ERROR,
    CUSTOMER_ERROR,
    BRANCH_ERROR
    } from '../actions/errorTypes';
import {
    ADD_NEW_CUSTOMER,
    GET_CUSTOMERS, 
    UPDATE_BRANCH, 
    ADD_NEW_BRANCH
    } from '../actions/types';


const defaultState = {
    message : "",
    customerActions : {},
    branchActions : {},
    authActions : {}
}


export default function(state=defaultState, action){
let newState, newCustomerAction;
const payload = action.payload;
switch(action.type){
    case CUSTOMER_ERROR:
        newState = _.cloneDeep(state);
        if(payload.actionName === ADD_NEW_CUSTOMER){
            newState.customerActions[ADD_NEW_CUSTOMER] = payload.errMessage;
        }
        return newState;
    case BRANCH_ERROR:
        newState = _.cloneDeep(state);
        if(payload.actionName === ADD_NEW_BRANCH){
            newState.branchActions[ADD_NEW_BRANCH] = payload.errMessage;
        }
        return newState;
    case AUTH_ERROR:
        newState = {...state, message:action.payload};
        return newState;
    case DEFAULT_ERROR:
        newState = {...state, message:action.payload};
        return newState;
    default:
        return {...state};
  }
}
