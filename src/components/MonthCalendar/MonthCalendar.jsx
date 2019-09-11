import _ from 'lodash';
import React, {Component} from 'react';
import txt from '../../text/config';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import './MonthCalendar.css';

const months = [txt.JANUARY, txt.FEBRUARY,txt.MARCH, txt.APRIL, txt.MAY, txt.JUNE, txt.JULY, txt.AUGUST,
    txt.SEPTEMBER, txt.OCTOBER, txt.NOVEMBER, txt.DECEMBER];
const baseRoot = "/myaccount/calendar";

class MonthCalendar extends Component {
    constructor(props){
        super(props);
        
        const today = new Date();
        const routeDate = new Date(this.props.match.params.year, this.props.match.params.month, this.props.match.params.date);
        if(this.props.match.params.date){
            this.state = {
                selectedDay: routeDate, 
                hourly: 0
                };
        }
        else{ //default, use todays date if no date in route
            this.state = {
                selectedDay: today, 
                hourly: 0
                };
        }

        const getLastDateOfSelectedMonth = this.getLastDateOfSelectedMonth.bind(this);
    }
componentDidMount(){
    this.setState({hourly : this.props.match.params.hourly});
}
componentDidUpdate(prevProps, prevState, snapshot){
    const prev = prevProps.match.params;
    const current = this.props.match.params;
    if (current.section == "calendar" && (
            current.date !== prev.date ||
            current.month !== prev.month ||
            current.year !== prev.year ||
            current.hourly !== prev.hourly) 
        ){
        const newDay = new Date(current.year, current.month, current.date);
        this.setState({selectedDay : newDay, hourly:current.hourly});
    }
}

getLastDateOfSelectedMonth(){
    const fullYear = this.state.selectedDay.getFullYear();
    return new Date(fullYear, this.state.selectedDay.getMonth()+1, 0);
}

getMonthDates(lastDatOfSelectedMonth, selectedMonthIndex, selectedYear ){
    const dates = [];
    const lastDate = lastDatOfSelectedMonth.getDate();
    if(lastDate >= 28 && lastDate <= 31){
        for(let i = 1; i <= lastDate; i++){
            const dateObj = new Date(selectedYear, selectedMonthIndex, i);
            dates.push(dateObj);
        }
    }
    return dates;
}

getPrevMonth(){
    const lastDayOfPreviousMonth = this.state.selectedDay.setDate(0); // 0 -> last date of previous month
    const newSelectedDay = new Date(lastDayOfPreviousMonth);
    const dateRoute = `${baseRoot}/date/${newSelectedDay.getDate()}/${newSelectedDay.getMonth()}/${newSelectedDay.getFullYear()}/${this.state.hourly}`;
    this.props.history.push(dateRoute);
}
getNextMonth(){
    const calendarSaved = this.props.calendar.saved;
    if(calendarSaved){
        const nextMonth = new Date(this.state.selectedDay.getFullYear(), this.state.selectedDay.getMonth()+1, 1);
        const dateRoute = `${baseRoot}/date/${nextMonth.getDate()}/${nextMonth.getMonth()}/${nextMonth.getFullYear()}/${this.state.hourly}`;
        this.props.history.push(dateRoute);
    }
    else{
        console.log("Calendar changes are not saved.");
        // TODO show error message -> calendar not saved
    }
}

    render(){
        const state = this.state;
        const lastDateOfSelectedMonth = this.getLastDateOfSelectedMonth();
        const monthDates = this.getMonthDates(
            lastDateOfSelectedMonth,
            state.selectedDay.getMonth(),
            state.selectedDay.getFullYear()
            );
        
        const startingWeekdayIndex = monthDates[0].getDay();
        const datesTable = [];
        let d = 1;
        let cycle = 1;
        const skip = startingWeekdayIndex; // 0 = Sun, 1 = Mon
        const maxDays = monthDates.length;
        let pr = monthDates[d-1];   //first date of the previous month?
        let thisMonth = pr.getMonth();
        let thisYear = pr.getFullYear();
        const y = this.state.selectedDay.getFullYear();
        const m = this.state.selectedDay.getMonth();
        const curD = this.state.selectedDay.getDate();
        while(cycle < 7){
            let row;
            let mon = "", tue = "", wed = "", thu = "", fri = "", sat = "", sun = "";
            let nextDate;
            if(cycle === 1){
                if(skip === 1){
                    row = <tr key={cycle} className="center aligned">
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 2){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 3){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 4){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 5){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 6){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d == curD ) ? `selectable active selected-highlight` : `selectable` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${++d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
                if(skip === 0){
                    row = <tr key={cycle} className="center aligned">
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className="selectable"></td>
                            <td className={(thisYear == y && thisMonth == m && d+1 == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }><Link to={`${baseRoot}/date/${d}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{d}</Link></td>
                        </tr>;
                }
            } 
            else if(d <= 30)
            {
                nextDate = new Date(thisYear, thisMonth, d);
                
                nextDate.setDate(nextDate.getDate()+1);
                d++;
                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays)
                     mon = nextDate.getDate();

                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays)
                     tue = nextDate.getDate();
                
                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays) 
                     wed = nextDate.getDate();

                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays) 
                     thu = nextDate.getDate();

                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays) 
                     fri = nextDate.getDate();

                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays) 
                     sat = nextDate.getDate();

                nextDate.setDate(nextDate.getDate()+1);
                d++;

                if(nextDate.getMonth() == thisMonth && 
                    nextDate.getFullYear() == thisYear && 
                    nextDate.getDate() <= maxDays) 
                     sun = nextDate.getDate();
row = <tr key={cycle} className="center aligned">
        <td className={(thisYear == y && thisMonth == m && mon == curD ) ? `selectable active selected-highlight` : `selectable` }>{mon ? <Link to={`${baseRoot}/date/${mon}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{mon}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && tue == curD ) ? `selectable active selected-highlight` : `selectable` }>{tue ? <Link to={`${baseRoot}/date/${tue}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{tue}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && wed == curD ) ? `selectable active selected-highlight` : `selectable` }>{wed ? <Link to={`${baseRoot}/date/${wed}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{wed}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && thu == curD ) ? `selectable active selected-highlight` : `selectable` }>{thu ? <Link to={`${baseRoot}/date/${thu}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{thu}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && fri == curD ) ? `selectable active selected-highlight` : `selectable` }>{fri ? <Link to={`${baseRoot}/date/${fri}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{fri}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && sat == curD ) ? `selectable active selected-highlight` : `selectable` }>{sat ? <Link to={`${baseRoot}/date/${sat}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{sat}</Link> : ""}</td>
        <td className={(thisYear == y && thisMonth == m && sun == curD ) ? `selectable active selected-highlight` : `selectable sunday-highlight` }>{sun ? <Link to={`${baseRoot}/date/${sun}/${thisMonth}/${thisYear}/${this.state.hourly}`}>{sun}</Link> : ""}</td>
    </tr>;
            }

            datesTable.push(row);
            cycle++;
        }

    const selectedMonth = months[state.selectedDay.getMonth()];
    const selectedYear = state.selectedDay.getFullYear();

        return(
            <div className="ui one column grid container">
                <div className="month-calendar">
                <table className="ui compact celled fixed collapsing unstackable table ">
                    <thead>
                        <tr className="center aligned">
                            <th>{txt.SHORT_MONDAY}</th>
                            <th>{txt.SHORT_TUESDAY}</th>
                            <th>{txt.SHORT_WEDNESDAY}</th>
                            <th>{txt.SHORT_THURSDAY}</th>
                            <th>{txt.SHORT_FRIDAY}</th>
                            <th>{txt.SHORT_SATURDAY}</th>
                            <th>{txt.SHORT_SUNDAY}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {datesTable}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colSpan="7">
                        <div className="ui center aligned">
                            <a className="ui button" onClick={this.getPrevMonth.bind(this)}>
                                <i className="long arrow alternate left icon"></i>
                            </a>
                            <a className="ui basic label">
                                {selectedMonth} {selectedYear}
                            </a>
                            <a className="ui button" onClick={this.getNextMonth.bind(this)}>
                                <i className="long arrow alternate right icon"></i>
                            </a>
                        </div>
                        </th>
                    </tr>
                    </tfoot>
                    </table>

                </div>
            </div>
        )
    }
}


export default withRouter(MonthCalendar);