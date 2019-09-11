import _ from 'lodash';
import {
    ADD_NEW_BRANCH,
    GET_BRANCHES,
    SET_BRANCH,
    UPDATE_BRANCH,
    SAVE_OPENING_HOURS,
    } from '../actions/types';

const defaultState = {
    branches : {},
    editBranchId : "0",
    errors: {ADD_NEW_BRANCH:"", GET_BRANCHES:""}

}

export default function(state=defaultState, action){
    let selectedBranch, branches, newBranches = {}, newState, branchId;
  switch(action.type){
    case ADD_NEW_BRANCH:
        branchId = action.payload._id;
        newState = _.cloneDeep(state);
        newState.branches[branchId] = {...action.payload};
        return newState;
    case GET_BRANCHES:
        branches = action.payload;
        newState = _.cloneDeep(state);
        branches.forEach(function(branch, index){
            newBranches[branch._id] = branch;
        }); 
        newState = {...state, branches : newBranches};
        return newState;
    case SET_BRANCH:
        branches = {...state.branches };
        return {...state, branches, selectedBranch : action.payload};
    case UPDATE_BRANCH:
        branchId = action.payload._id;
        newState = _.cloneDeep(state);
        newState.branches[branchId] = {...action.payload};
        return newState;
    case SAVE_OPENING_HOURS:
        branchId = action.payload._id;
        newState = _.cloneDeep(state);
        newState.branches[branchId] = {...action.payload};
        return newState;
    default:
        return {...state};
  }
}

