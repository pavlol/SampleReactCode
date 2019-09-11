import _ from 'lodash';
import {
    UPDATE_CALENDAR,
    INIT_REDUX_CALENDAR,
    MARK_CALENDAR_SAVED,
    ASSIGN_CUSTOMER_TO_TIMESLOT,
    GET_BRANCH_CALENDAR,
    SET_SELECTED_CUSTOMER,
    SET_APPOINTMENT_DURATION,
    SET_APPOINTMENT_DETAILS,
    SYNC_APPOINTMENT
    } from '../actions/types';

const defaultState = {
    year: new Date().getFullYear(),
    monthIndex : new Date().getMonth(),
    selectedDate : new Date().getDate(),
    timeSlots: {
    },
    appointmentDurations : [
    ],
    startTimes : ["07:00", "07:30", "08:00","08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00" ],
    saved: true
}


export default function(state=defaultState, action){
let days, newState, newTimeslot, newDay, newDays, newTimeSlotData, existingTimeSlotData, clonedExistingDays,
monthIndex, year, selectedDate, timeSlot, customerId, durationIndex, durationHours, appointmentDetails;
switch(action.type){
    case UPDATE_CALENDAR:
        newTimeslot = {...state.days[action.payload.date][action.payload.timeslot], ...action.payload.details};
        newDay = {...state.days[action.payload.date], [action.payload.timeslot]: newTimeslot };
        newDays = {...state.days, [action.payload.date]: newDay };
        newState = {...state, "days": newDays, saved:false };
        return newState;
    case INIT_REDUX_CALENDAR:
        return {...state};
    case GET_BRANCH_CALENDAR:
        const appointmentDurations = [];
        let duration = 0;
        while(duration < 10){
            duration = duration + 0.5;
            appointmentDurations.push(duration);
        }
        let dateData = action.payload.dateData; 
        year = action.payload.year;
        monthIndex = action.payload.monthIndex;
        selectedDate = action.payload.selectedDate;

        let timeSlots = {};
        if(dateData){
            dateData.timeSlots.forEach(function(t, i){
                timeSlots[t.timeSlot] = {
                    customer: t.timeSlotData.customer, 
                    details: t.timeSlotData.details, 
                    notes: t.timeSlotData.notes,
                    durationHours: t.timeSlotData.durationHours ? t.timeSlotData.durationHours : 0.5,
                    durationIndex: t.timeSlotData.durationIndex ? t.timeSlotData.durationIndex : 0};
            });
        }

        newState = {...state, selectedDate, year, monthIndex, timeSlots, appointmentDurations };
        return {...newState};
    case MARK_CALENDAR_SAVED:
        days = _.cloneDeep(state.days);
        newState = {...state, days, saved:true};
        return newState;
    case ASSIGN_CUSTOMER_TO_TIMESLOT:
        let {customer, selectedTimeSlot, durationIndex, durationHours, details} = action.payload;
        let existingTimeSlots = _.cloneDeep(state.timeSlots);
        existingTimeSlots[selectedTimeSlot] = { customer, details, durationHours, durationIndex };
        newState = {...state, timeSlots: existingTimeSlots, saved:false};
        return newState;
    case SET_SELECTED_CUSTOMER:
        customerId = action.payload.customerId;
        timeSlot = action.payload.timeSlot;
        newState = _.cloneDeep(state);
        if(!newState.timeSlots[timeSlot]){
            newState.timeSlots[timeSlot] = {
                customer : customerId,
                durationIndex:0, 
                durationHours:state.appointmentDurations[0]
                };
        }
        else{
            newState.timeSlots[timeSlot].customer = customerId;
        }
        return newState;
    case SET_APPOINTMENT_DURATION:
        timeSlot = action.payload.timeSlot;
        durationIndex = action.payload.durationIndex;
        durationHours = state.appointmentDurations[durationIndex];
        console.log(SET_APPOINTMENT_DURATION, timeSlot, durationIndex);
        newState = _.cloneDeep(state);
        if(!newState.timeSlots[timeSlot]){
            newState.timeSlots[timeSlot] = {customer : "0", durationIndex, durationHours};
        }
        else {
            newState.timeSlots[timeSlot].durationIndex = durationIndex;
            newState.timeSlots[timeSlot].durationHours = durationHours;
        }
        return newState;
    case SET_APPOINTMENT_DETAILS:
        timeSlot = action.payload.timeSlot;
        appointmentDetails = action.payload.appointmentDetails;
        newState = _.cloneDeep(state);
        if(!newState.timeSlots[timeSlot]){
            newState.timeSlots[timeSlot] = {
                customer : "0", 
                durationIndex:0, 
                durationHours:state.appointmentDurations[0],
                details : appointmentDetails}
        }
        else {
            newState.timeSlots[timeSlot].details = appointmentDetails;
        }
        return newState;
    case SYNC_APPOINTMENT:

        return {...state};
    default:
        return {...state};
  }
}
