export default function({ dispatch }){
  return next => action => {
    console.log();

    if(!action.payload || !action.payload.then){  //if not a promise, pass it on
      return next(action);
    }

    action.payload.then(function(response){
     const newAction = {...action, payload:response }
     dispatch(newAction);
    });

  }
}
