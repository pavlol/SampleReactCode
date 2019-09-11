import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import txt from '../../text/config';
import {SELECTED_BRANCH_ID} from '../../actions/types';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import Customer from '../Customer/Customer';
import './HourlyCalendar.css';

const localeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const baseRoot = "/myaccount/calendar";

class HourlyCalendar extends Component {
    constructor(props){
        super(props);

        if(this.props.match.params.date){
            this.state = {
                hourly: 0,
                modalOpen: false,
                modalNewCustomerOpen: false,
                closeOnEscape : true, 
                closeOnDimmerClick : false,
                selectedTimeSlot: "",
                };
        }
        else{ //default, use todays date if no date in route
            this.state = {
                // selectedDay: today, 
                hourly: 0,
                modalOpen:false,
                modalNewCustomerOpen: false,
                closeOnEscape : true, 
                closeOnDimmerClick : false,
                selectedTimeSlot: "",
                };
        }

        const handleValueChanger = this.handleValueChanger.bind(this);
        const buildCustomersDdlOptons = this.buildCustomersDdlOptons.bind(this);
        this.getCalendarFromDb(this.props.match.params); 
        this.loadCustomers();
    }

    getCalendarFromDb(urlParams){
        const year = urlParams.year;
        const monthIndex = urlParams.month;
        const selectedDate = urlParams.date;
        const branchId = localStorage.getItem(SELECTED_BRANCH_ID);
        const payload = {year, monthIndex, selectedDate, branchId};
        if(branchId && monthIndex && year && selectedDate){
            this.props.getBranchCalendar(payload, (err)=>{
                if(err){
                    alert("no db connection");
                }
            });
        }
    }

    loadCustomers(){
        this.props.getCustomers((error)=>{
            console.log("________get customers callback", error);
        });
    }

    onOpenModal = (e) => {
        const selectedTimeSlot = e;
        this.setState({ 
            modalOpen: true,
            selectedTimeSlot
            });
    };
 
    onCloseModal = () => {
        this.setState({ modalOpen: false });
    };

    handleNewCustomerModalOpen = () => {
        this.setState({modalNewCustomerOpen : true});
    };

    handleNewCustomerModalClose = () => {
        this.setState({modalNewCustomerOpen : false});
    };

    addSelectedCustomerToTimeSlot = () => {
        const payload = {
            selectedTimeSlot: this.state.selectedTimeslot,
            }
        this.props.assignCustomerToTimeSlot(payload);
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
            this.setState({selectedDay : newDay,  hourly:current.hourly});
            this.getCalendarFromDb(current);
        }
    }

    handleDdlSelectCustomer = (e, data) => {
        this.props.setSelectedCustomer(data.value, this.state.selectedTimeSlot);
    }
    handleDdlSelectDuration = (e, data) => {
        const durationIndex = data.value;
        this.props.setAppointmentDuration(durationIndex, this.state.selectedTimeSlot);
    }
    handleAppointmentDetailsInput(e){
        const appointmentDetails = e.target.value;
        this.props.setAppointmentDetails(appointmentDetails, this.state.selectedTimeSlot);
    }


    handleValueChanger(e){
        const payload = { 
            "date" : e.target.dataset.date,
            "timeslot" : e.target.dataset.timeslot,
            "details" : { details: e.target.value,  notes:""}
            };
        this.props.updateCalendar(payload);
    }

    saveAppointment(){
        const selectedTimeSlotData = this.props.calendar.timeSlots[this.state.selectedTimeSlot];
        if(selectedTimeSlotData && selectedTimeSlotData.customer !== "0"){
            const {year, monthIndex, selectedDate, timeSlots} = this.props.calendar;
            const appointment = { year, monthIndex, selectedDate, 
                timeSlot : this.state.selectedTimeSlot, 
                timeSlotData : selectedTimeSlotData
            };
            const values = {branchId : this.props.branch.selectedBranch, appointment};
            this.props.saveAppointment(values, (err)=> {
                if(!err){
                    this.setState({ modalOpen: false });
                }
                else{
                }
            });
        }
        else{
            this.handleNewCustomerModalOpen();
        }
    }

    saveCalendar(){
        const selectedTimeSlot = this.props.calendar.timeSlots[this.state.selectedTimeSlot];
        const values = {branch : this.props.branch, calendar : this.props.calendar};
        this.props.saveCalendar(values);
    }

    buildCustomersDdlOptons(){
        const ddlCustomers = _.map(this.props.customers.customers, function(obj,key){
            const text = `${obj.firstName} ${obj.lastName} ${obj.middleName}`;
            return {key, text, value:key}
        });
        const newOption = { key: '0', value: '0', text: txt.NEW_CUSTOMER};
        ddlCustomers.unshift(newOption);
        return ddlCustomers;
    }

    buildAppointmentDurationDdlOptions(){
        const ddl = this.props.calendar.appointmentDurations.map(function(obj, index){
            const text = `${obj}`;
            return { key : index, text, value : index};
        });
        return ddl;
    }

    render(){
        const { 
            modalOpen, 
            closeOnEscape, 
            closeOnDimmerClick, 
            selectedCustomer, 
            selectedTimeSlot 
            } = this.state;
        
        const customersList = this.props.customers.customers; 
        const {addNewCustomer, error} = this.props;
        const ddlCustomersOptions = this.buildCustomersDdlOptons();
        const ddlAppointmentDurationOptions = this.buildAppointmentDurationDdlOptions();
        const propsDurations = this.props.appointmentDurations;
        const slotStep = propsDurations ?  propsDurations[1] - propsDurations[0] : 0.5; // default time slot 0.5 hours
        const propsStartTimes = this.props.calendar.startTimes; 
        const propsTimeSlots = this.props.calendar.timeSlots;
        const propsYear = this.props.calendar.year;
        const propsMonthIndex = this.props.calendar.monthIndex;
        const propsDate = this.props.calendar.selectedDate;
        const selectedDay = new Date(propsYear, propsMonthIndex, propsDate);
        const dateLabelText = selectedDay.toLocaleDateString('ru-UA', localeOptions);
        let skipRows = 1;
        const timeSlotsFilled = propsStartTimes.map((value, index) => {
            const slotData = propsTimeSlots[value];
            let fullCustomerNameText = txt.AVAILABLE;

            if(slotData){
            
            if(slotData.customer !== "0"){
                const assignedCustomer = customersList[slotData.customer];
                const fn = assignedCustomer && assignedCustomer.firstName ? assignedCustomer.firstName : "";
                const ln = assignedCustomer && assignedCustomer.lastName ? assignedCustomer.lastName : "";
                const mn = assignedCustomer && assignedCustomer.middleName ? assignedCustomer.middleName : "";
                fullCustomerNameText = `${fn} ${ln} ${mn}`;
            }
            else if(slotData.details){
                fullCustomerNameText = txt.NO_CUSTOMER_SELECTED;
            }
            else{
                console.log("fullCustomerNameText else", fullCustomerNameText);
            }
            const rowSpan = slotData.durationHours ? slotData.durationHours / slotStep : 1;  // 1 -> one row by default if only one slot taken by appointment
            if(rowSpan > 1){
                skipRows = rowSpan;
            }
                return (
                    <tr key={index} className="center aligned">
                        <td className="time-row">{value}</td>
                        <td rowSpan={rowSpan} className={fullCustomerNameText == txt.NO_CUSTOMER_SELECTED ? "ui negative basic" : "active" }>
                            {fullCustomerNameText == txt.NO_CUSTOMER_SELECTED ? <i className="attention icon"></i> : "" }
                            <div className="ui basic medium labeled icon button"
                            onClick={this.onOpenModal.bind(this, value)}>
                            <i className="edit outline icon"></i>{fullCustomerNameText}</div>
                        </td>
                    </tr>
                )
            }
            else {
                if(skipRows > 1){
                    skipRows--;
                    return (
                        <tr key={index} className="center aligned">
                            <td className="time-row">{value}</td>
                        </tr>
                    )
                }
                else{
                    return (
                        <tr key={index} className="center aligned">
                            <td className="time-row">{value}</td>
                            <td className="">
                                    <div className="ui basic positive medium labeled icon button"
                                    onClick={this.onOpenModal.bind(this, value)}>
                                    <i className="edit outline icon"></i>{fullCustomerNameText}</div>
                            </td>
                        </tr>
                    )
                } 
            }
        });

        return(
            <div className="hourly-calendar">

                <table className="ui celled definition stackable structured table">
                    <thead>
                    <tr className="center aligned">
                        <th colSpan="2" className="six wide">
                            <div className="ui left floated mini green labeled icon button"
                                onClick={this.saveCalendar.bind(this)}>
                                <i className="save icon"></i>{txt.SAVE}
                            </div>
                            <span className="date-label">{dateLabelText}</span>
                        </th>
                    </tr>
                    <tr className="center aligned">
                        <th className="time-row"></th>
                        <th>{txt.SPECIALIST} 1</th>
                    </tr>
                    </thead>
                    <tbody>
                        {timeSlotsFilled}
                    </tbody>
                    <tfoot className="full-width">
                        <tr>
                        <th colSpan="2">
                            <div className="ui left floated small green labeled icon button"
                            onClick={this.saveCalendar.bind(this)}>
                                <i className="save icon"></i>{txt.SAVE}
                            </div>
                        </th>
                        </tr>
                    </tfoot>
                    </table>
                    <Modal 
                        centered={false}
                        open={this.state.modalOpen}
                        onClose={this.onCloseModal}
                        size='tiny'
                        closeIcon
                        closeOnEscape={closeOnEscape}
                        closeOnDimmerClick={closeOnDimmerClick}
                    >
                    <Header icon='address book outline' content={txt.NEW_APPOINTMENT} />
                    <Modal.Content image scrolling>
                        <Modal.Description>
                            <Dropdown
                                onChange={this.handleDdlSelectCustomer}
                                placeholder={txt.SEARCH_DOTS}
                                fluid
                                search
                                selection
                                value = {propsTimeSlots[selectedTimeSlot] ? propsTimeSlots[selectedTimeSlot].customer : "0"}
                                options={ddlCustomersOptions}
                                button
                            />
                            <p>
                                <label>How long the appointment?</label>
                            </p>
                            <Dropdown 
                                onChange={this.handleDdlSelectDuration}
                                selection
                                value = {propsTimeSlots[selectedTimeSlot] ? propsTimeSlots[selectedTimeSlot].durationIndex : 0}
                                options={ddlAppointmentDurationOptions}
                                button
                            />
                            <label>hours</label>
                            <p>Appointment details:</p>
                            <p>
                                <textarea rows="10" 
                                value={(this.state.selectedTimeSlot && propsTimeSlots[this.state.selectedTimeSlot]) 
                                ? propsTimeSlots[this.state.selectedTimeSlot].details : "" } 
                                onChange={this.handleAppointmentDetailsInput.bind(this)}></textarea>
                            </p>
                        <p className="modal-vertical-size-setter"></p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={this.saveAppointment.bind(this)} inverted>
                            <Icon name='checkmark' /> {txt.SAVE}
                        </Button>
                        <Modal
                            open={this.state.modalNewCustomerOpen}
                            onOpen={this.handleNewCustomerModalOpen}
                            onClose={this.handleNewCustomerModalClose}
                            size='small'
                            closeOnEscape={closeOnEscape}
                            closeOnDimmerClick={closeOnDimmerClick}
                            trigger={
                            <Button secondary basic icon>
                                {txt.NEW_CUSTOMER} <Icon name='user plus' />
                            </Button>
                            }
                        >
                            <Modal.Header>{txt.NEW_CUSTOMER}</Modal.Header>
                            <Modal.Content>
                                <Customer 
                                    addNewCustomer={addNewCustomer}
                                    customerErrors = {error.customerActions}
                                    handleNewCustomerModalClose = {this.handleNewCustomerModalClose}
                                    customers = {customersList}
                                />
                            </Modal.Content>
                            <Modal.Actions>
                                <Button icon='close' content={txt.CLOSE} onClick={this.handleNewCustomerModalClose} />
                            </Modal.Actions>
                        </Modal>
                    </Modal.Actions>
                    </Modal>
            </div>
        )
    }
}

export default withRouter(HourlyCalendar);
