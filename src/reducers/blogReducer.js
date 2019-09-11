import {SAVE_ARTICLE} from '../actions/types';

const defaultState = {
    articles : {article1: "initial article state text"}
}

export default function(state=defaultState, action){
  switch(action.type){
    case SAVE_ARTICLE:
        const newArticle = {...state.articles, ...action.payload};
        return {...state, articles:newArticle};
    default:
        return {...state};
  }
}