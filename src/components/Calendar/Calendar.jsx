import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import txt from '../../text/config';
import MonthCalendar from '../MonthCalendar/MonthCalendar';

import './Calendar.css';

class Calendar extends Component {

    
    render(){
        return(
        <div>
            <MonthCalendar></MonthCalendar>
            <div></div>
        </div>
        )
      }
}


export default Calendar;
