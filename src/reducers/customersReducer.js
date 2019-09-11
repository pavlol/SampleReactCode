import _ from 'lodash';
import {
    ADD_NEW_CUSTOMER,
    GET_CUSTOMERS,
    SET_EDIT_CUSTOMER_ID,
    UPDATE_CUSTOMER
    } from '../actions/types';

const defaultState = {
    customers : {
        1: {firstName : "Pervij", lastName: "Client", middleName:""},
        2: {firstName : "Vtoroj", lastName: "Zakazchik", middleName:""},
        3: {firstName : "Tretij", lastName: "Pokupatel", middleName:""},
    },
    saved : true,
    editCustomerId : "0",
    errors: {ADD_NEW_CUSTOMER:"", GET_CUSTOMERS:""}

}


export default function(state=defaultState, action){
let newCustomer, newState, newCustomers={}, customerId, existingClonedCustomers;
switch(action.type){
    case ADD_NEW_CUSTOMER:
        let {customerId, customer} = action.payload;
        newCustomer = {[customerId] : customer};
        existingClonedCustomers = _.cloneDeep(state.customers);
        newCustomers = {...existingClonedCustomers, ...newCustomer};
        newState = {...state, customers : newCustomers};
        return newState;
    case GET_CUSTOMERS:
        let {customers} = action.payload;
        customers.forEach(function(customer, index){
            let {firstName, lastName, middleName} = customer; 
            newCustomers[customer._id] = { firstName, lastName, middleName };
        }); 
        newState = {...state, customers : newCustomers};
        return newState;
    case SET_EDIT_CUSTOMER_ID:
        newState = _.cloneDeep(state);
        newState.editCustomerId = action.payload.customerId;
        return newState;
    case UPDATE_CUSTOMER:
        customerId = action.payload._id;
        const {firstName, lastName, middleName} = action.payload;
        newState = _.cloneDeep(state);
        newState.customers[customerId] = {firstName, lastName, middleName};
        return newState;
    default:
        return {...state};
  }
}
