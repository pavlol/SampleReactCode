import _ from 'lodash';
import axios from "axios";
import runtimeEnv from '@mars/heroku-js-runtime-env';
import * as types from './types';
import * as errText from './errorTypes';  
import * as errTypes from './errorTypes'; 

const API_PORT = process.env.NODE_ENV === 'production' ? "443" : require('../config').API_PORT ;


const env = runtimeEnv();
const Api_Url = API_URL; // process.env.API_URL ? process.env.API_URL : API_URL;
const Api_Port = API_PORT; // process.env.API_PORT ? process.env.API_PORT : API_PORT;
const API_ADDRESS = `${Api_Url}:${Api_Port}`;

export function createItem(values, callback){
  console.log('values',values);
  callback();

  return {
    type:types.CREATE_ITEM,
    payload:values
  }
}


export function signinUser({email, password}, callback){
  return function(dispatch){   
    axios.post(`${API_ADDRESS}/signin`, {email, password})
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("accessLevel", response.data.accessLevel);
        localStorage.setItem("name", response.data.name);
        dispatch({
          type:types.AUTH_USER,
          payload: response.data
          });
        callback(false);
      })
      .catch((e)=>{
        let customMessage = e.response ? e.response.data : "";
        if(e.response && e.response.status == 401){
          callback(true, customMessage);
        }
        else{
          const combinedErrorMessage = `${e.message}`;
          callback(true, combinedErrorMessage);
        }
       });
  }
}

export function signupUser({name, email, password, accessLevel}, callback){
  return function(dispatch){
    axios.post(`${API_ADDRESS}/signup`, {name, email, password, accessLevel})
    .then(response => {
      console.log('sign up ok', response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("accessLevel", response.data.accessLevel);
      localStorage.setItem("name", response.data.name);
      dispatch({
        type: types.AUTH_USER,
        payload: response.data
        });
      callback();
    })
    .catch(error => {
      dispatch(signupError(error));
    })
  }
}


export function signupError(error){
  console.log('dispatch error!!', error);
  return{
    type: types.AUTH_ERROR,
    payload: error
  }
}

export function signoutUser(){
  localStorage.removeItem("token");
  localStorage.removeItem("accessLevel");
  return {
    type:types.UNAUTH_USER
    };
}

export function recoverAccess(email, callback){
  if(!email){
    callback(true, "Email is empty");
    return;
  }
  else{
    return function(dispatch){
      axios.post(`${API_ADDRESS}/email/password/recovery`, {email}, {
          // headers: {authorization : localStorage.getItem('token')}
        }
      )
      .then(response => {
        //TODO
        if(response.status == 200){
          dispatch({
            type: "test",
            payload : {}
          });
          callback(false);
        }
        else{
          callback(true, response.message ? response.message : "Error sending recovery email, try again...");
        }
      })
      .catch(e => {
        console.log("recoverAccess", e);
        callback(true, e.message);
      });
    }
  }
}

export function resetPassword({recoveryId, newPassword,email}, callback){
  if(!recoveryId){
    callback(true, "Recovery Id is empty");
    return;
  }
  else if(!newPassword){
    callback(true, "New Password is empty");
    return;
  }
  else if(!email){
    callback(true, "Email is empty");
    return;
  }
  else{
    return function(dispatch){
      axios.post(`${API_ADDRESS}/user/password/reset`, {recoveryId, newPassword, email}, {
          // headers: {authorization : localStorage.getItem('token')}
        }
      )
      .then(response => {
        //TODO
        if(response.status == 200){
          dispatch({
            type: "passwordReset",
            payload : {}
          });
          callback(false);
        }
        else{
          callback(true, response.message ? response.message : "Error changing password, try again...");
        }
      })
      .catch(e => {
        console.log("recoverAccess", e);
        callback(true, e.message);
      });
    }
  }
}

export function fetchMessage(){
  return function(dispatch){
    axios.get(API_ADDRESS, {
      headers: {authorization : localStorage.getItem('token')}
    })
    .then(response=>{
      console.log(response);
      dispatch({
        type: types.FETCH_MESSAGE,
        payload:response.data.message
      })
    })
  }
}

export function saveArticle(values, callback){
  callback();
  return {
    type:types.SAVE_ARTICLE,
    payload:values
  }
}

export function addNewBranch({name, email, address, phoneNumber, coord}, callback){
  const requestData = {name, email, address, phoneNumber, coord};
  return function(dispatch){          // redux-thunk will call this method
    axios.post(`${API_ADDRESS}/branch/create`, requestData,
    {
       headers: {
                  // 'Content-Type': 'application/json',
                  'authorization': localStorage.getItem('token')
                },
      
    })
      .then(response => {
        // console.log('response.data',response.data);
        dispatch({
          type:types.ADD_NEW_BRANCH,
          payload: response.data
          });
          callback();
        })
        .catch(()=>{
          dispatch(requestError('Wrong branch details'));
        });
  }
}

export function getBranches(callback){
  return function(dispatch){
    axios.get(`${API_ADDRESS}/branches`, {
        headers: {authorization : localStorage.getItem('token')}
      }
    )
      .then(response => {
        dispatch({
          type:types.GET_BRANCHES,
          payload: response.data
          });
        })
        .then(()=>{
          dispatch(setBranch());
        })
        .catch((e)=>{
          console.log("error getBranches", e.message);
          dispatch(requestError('error get branches')); //TODO
        });
  }
}

export function saveOpeningHours(branchOpeningHours, branchId, callback){
  const requestData = {branchId, branchOpeningHours};
  return function(dispatch){
    axios.put(`${API_ADDRESS}/branch/openinghours`, requestData, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        dispatch({
          type : types.SAVE_OPENING_HOURS,
          payload : response.data
        });
        callback(false);  // false -> no error
      })
      .catch((e)=>{
        console.log("updateBranch error message", e.message);
        const combinedError = `${e.message}`;
        dispatch(
          {
            type: errTypes.BRANCH_ERROR,
            payload:{ errMessage: combinedError, actionName: types.ERROR_UPDATE_BRANCH }
          });
        callback(true); // true -> error
      });
  }
}



export function updateBranch(values, callback){
  const {branchId, name, address, phoneNumber, email, coord} = values;
  const requestData = {branchId, name, address, phoneNumber, email, coord};
  return function(dispatch){
    axios.put(`${API_ADDRESS}/branch`, requestData, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        dispatch({
          type : types.UPDATE_BRANCH,
          payload : response.data
        });

        callback(false);  // false -> no error
      })
      .catch((e)=>{
        console.log("updateBranch error message", e.message);
        const combinedError = `${e.message}`;
        dispatch(
          {
            type: errTypes.BRANCH_ERROR,
            payload:{ errMessage: combinedError, actionName: types.ERROR_UPDATE_BRANCH }
          });
        callback(true); // true -> error
      });
  }
}


export function setBranch(branchId, callback){  // in branch is undefined => initial load
    let payload = branchId;
    return function(dispatch){
      try{
        if(!branchId){
          if(localStorage.getItem(types.SELECTED_BRANCH_ID)) {
            payload = localStorage.getItem(types.SELECTED_BRANCH_ID);
          }
          else{
            localStorage.setItem(types.SELECTED_BRANCH_ID, "0");
            payload = 0;
          }
        }
        else if(branchId){
          localStorage.setItem(types.SELECTED_BRANCH_ID, payload);
          payload = branchId;
        }
        
        dispatch({
          type: types.SET_BRANCH,
          payload
        });
  
        if(callback){
          callback(false);
        }
      }
      catch(err){
        callback(true, err.message);
      }
    }
  };

export function updateCalendar(values, callback){
  return {
    type:types.UPDATE_CALENDAR,
    payload: values
  }
}

export function setAppointmentDetails(appointmentDetails, timeSlot){
  return{
    type: types.SET_APPOINTMENT_DETAILS,
    payload: {appointmentDetails, timeSlot}
  }
}
export function setAppointmentDuration(durationIndex, timeSlot){
        console.log("setAppointmentDuration", durationIndex, timeSlot);

  return{
    type:types.SET_APPOINTMENT_DURATION,
    payload:{durationIndex, timeSlot}
  }
}
export function setSelectedCustomer(customerId, timeSlot){
  return {
    type: types.SET_SELECTED_CUSTOMER,
    payload : {customerId, timeSlot}
  }
}
export function setSelectedCustomerEdit(customerId){
  return {
    type: types.SET_EDIT_CUSTOMER_ID,
    payload : {customerId}
  }
}
export function assignCustomerToTimeSlot(payload){
  return {
    type: types.ASSIGN_CUSTOMER_TO_TIMESLOT,
    payload 
  }
}
export function saveAppointment(values, callback){
  const requestData = { branchId : values.branchId, appointment : values.appointment };
  return function(dispatch){
    axios.post(`${API_ADDRESS}/calendar/appointment`, values, {
        headers: {authorization : localStorage.getItem('token')}
      }
    )
    .then(response => {
      dispatch({
        type:types.SYNC_APPOINTMENT,
        payload: response.data
      });
      callback(false);
    })
    .catch((e)=>{
        dispatch(requestError('save appointment error'));
    });
  }
}
export function saveCalendar(values, callback){
  const requestData = { branchId: values.branch.selectedBranch, calendar : values.calendar };
  return function(dispatch){ 
    axios.post(`${API_ADDRESS}/calendar/update`, requestData, {
        headers: {authorization : localStorage.getItem('token')}
      }
    )
    .then(response => {
      dispatch({
        type:types.MARK_CALENDAR_SAVED,
        payload: true
      });
      callback(false);
    })
    .catch((e)=>{
        dispatch(requestError('save calendar error')); 
    });
  }
}

export function addNewCustomer(values, callback){
  const requestData = values;
  return function(dispatch){
    axios.post(`${API_ADDRESS}/customer/addnew`, requestData, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        // console.log('response.data', response.data);
        const payload = {customer : values, customerId : response.data._id};
        
        dispatch({
          type : types.ADD_NEW_CUSTOMER,
          payload
        });

        dispatch({
          type: errTypes.CUSTOMER_ERROR,
          payload:{ errMessage: "", actionName: types.ADD_NEW_CUSTOMER }
        });

        callback(false);  // false -> no error
      })
      .catch((e)=>{
        console.log("addNewCustomer error message", e.message);
        console.log("addNewCustomer error message", e.response.data.message);
        const combinedError = `${e.message}. ${e.response.data.message}`;
        dispatch(
          {
            type: errTypes.CUSTOMER_ERROR,
            payload:{ errMessage: combinedError, actionName: types.ADD_NEW_CUSTOMER }
          });
        callback(true); // true -> error
      });
  }
}

export function editCustomer(values, callback){
  const {customerId, firstName, lastName, middleName} = values;
  const requestData = {customerId, firstName, lastName, middleName};
  return function(dispatch){
    axios.put(`${API_ADDRESS}/customer`, requestData, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        const payload = {
          firstName : response.data.firstName, 
          lastName : response.data.lastName,
          middleName : response.data.middleName,
          customerId : response.data._id};
        
        dispatch({
          type : types.UPDATE_CUSTOMER,
          payload : response.data
        });
        callback(false);  // false -> no error
      })
      .catch((e)=>{
        console.log("updateCustomer error message", e.message);
        const combinedError = `${e.message}`;
        dispatch(
          {
            type: errTypes.CUSTOMER_ERROR,
            payload:{ errMessage: combinedError, actionName: types.ERROR_UPDATE_CUSTOMER }
          });
        callback(true); // true -> error
      });
  }
}

export function getCustomers(callback){
  return function(dispatch){
    axios.get(`${API_ADDRESS}/customers`, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        const payload = {customers : response.data};
        dispatch({
          type:types.GET_CUSTOMERS,
          payload
          });
        })
        .catch((e)=>{
          console.log("catch error message", e.message);
          dispatch(
            {
              type: errTypes.CUSTOMER_ERROR,
              payload:e.message
            });
          callback(true); // true -> error
        });
  }
}


export function findCoordByAddress(values, callback){
  const {address, branchId} = values;
  
  return function(dispatch){
    axios.get('https://nominatim.openstreetmap.org/search?format=json&q=' + address, {
        // headers: {}
      }
    ).then(response => {
        console.log('findCoordsByAddress response.data', response.data[0]);
        if(response.data && response.data.length > 0){
          const coord = [response.data[0].lat, response.data[0].lon];
          const payload = {coord, address, branchId};

          dispatch({
            type:types.FIND_COORD_BY_ADDRESS,
            payload
            });
          
          callback(false, "", coord);  // false -> no error
        }
        else{
          callback(true, "Address not found", []);  // false -> no error
        }
      })
      .catch((e)=>{
        console.log("catch error message", e.message);
        callback(true, e.message, []); // true -> error
      });
  }
}

export function getBranchesByArea(initialSearchBounds, callback){
  //initialSearchBounds = [[50.15, 36], [49.85, 36.45]];
  const latmax = initialSearchBounds[0][0];
  const lonmax = initialSearchBounds[1][1];
  const latmin = initialSearchBounds[1][0];
  const lonmin = initialSearchBounds[0][1];

  return function(dispatch){
    axios.get(`${API_ADDRESS}/branches/${latmax}/${lonmax}/${latmin}/${lonmin}`, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        if(response.data && response.data.length > 0){

          const payload = response.data;

          dispatch({
            type:types.SET_BRANCHES_COORDS,
            payload
            });
          
          callback(false);  // false -> no error
        }
        else{
          callback(true, "Branches not found");  // false -> no error
        }
      })
      .catch((e)=>{
        console.log("catch error message", e.message);
        callback(true, e.message); // true -> error
      });
  }
}


export function findAreaCoordByLocationName(values, callback){
  let {place} = values;
  return function(dispatch){
    axios.get('https://nominatim.openstreetmap.org/search?format=json&q=' + place, {
        // headers: {}
      }
    ).then(response => {
        if(response.data && response.data.length > 0){
          const payload = {
            coord : [response.data[0].lat, response.data[0].lon], 
            address : response.data[0].display_name, 
            type : response.data[0].type
            };

          dispatch({
            type:types.FIND_COORD_BY_LOCATION_NAME,
            payload
            });
          
          callback(false, "",  payload);  // false -> no error
        }
        else{
          callback(true, "Address not found");  // false -> no error
        }
      })
      .catch((e)=>{
        console.log("catch error message", e.message);
        callback(true, e.message); // true -> error
      });
  }
}

export function findBranchesByAvailableDate(values, callback){
  const {date, searchBounds} = values;
  const latmax = searchBounds[0][0];
  const lonmax = searchBounds[1][1];
  const latmin = searchBounds[1][0];
  const lonmin = searchBounds[0][1];
  
  return function(dispatch){
    axios.get(`${API_ADDRESS}/calendar/available/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${date.getDay()}/${latmax}/${lonmax}/${latmin}/${lonmin}` , {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        const payload = response.data;

        dispatch({
          type:types.SET_BRANCHES_COORDS,
          payload
          });
          callback(false);  // false -> no error
        })
        .catch((e)=>{
          console.log("catch error message", e.message);
          callback(true, e.message); // true -> error
        });
  }
}

export function getBranchCalendar(values, callback){
  const {year, monthIndex, selectedDate, branchId} = values;

  return function(dispatch){
    axios.get(`${API_ADDRESS}/calendar/branch/${branchId}/${year}/${monthIndex}/${selectedDate}`, {
        headers: {authorization : localStorage.getItem('token')}
      }
    ).then(response => {
        const payload = {dateData : response.data.dateData, year, monthIndex, selectedDate};

        dispatch({
          type:types.GET_BRANCH_CALENDAR,
          payload
          });
          callback(false);  // false -> no error
        })
        .catch((e)=>{
          console.log("catch error message", e.message);
          callback(true, e.message); // true -> error
        });
  }
}

// ERROR HANDLER ACTION FOR ALL
export function requestError(errorMessage){
  console.log('request error!!', errorMessage);
  if(errorMessage === errText.NETWORK_ERROR){
   return {
      type: errText.NETWORK_ERROR,
      payload: errorMessage
    } 
  }
  else if (errorMessage === errText.AUTH_ERROR){
    return {
      type: errText.AUTH_ERROR,
      payload: errorMessage
    }
  }
  else{
    return {
      type: errText.DEFAULT_ERROR,
      payload: errorMessage
    }
  }
}


