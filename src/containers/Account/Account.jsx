import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import TopMenu from '../../components/TopMenu/TopMenu';
import ProviderMenu from '../../components/ProviderMenu/ProviderMenu';
import NewBranchForm from "../../components/NewBranchForm/NewBranchForm";
import HourlyCalendar from "../../components/HourlyCalendar/HourlyCalendar";
import MonthCalendar from "../../components/MonthCalendar/MonthCalendar";

import * as actions from '../../actions';
import './Account.css';
import txt from '../../text/config';

class Account extends Component{
    constructor(props){
        super(props);
      
        this.state = {
            routeSection : this.props.match.params.section,
            calendarHourly:this.props.match.params.hourly,
          }
        this.props.getBranches();
    }
    
    componentDidMount(){ }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.props.match.params.section !== prevProps.match.params.section) {
            this.setState({routeSection : this.props.match.params.section});
        }
        if (this.props.match.params.hourly !== prevProps.match.params.hourly) {
            this.setState({calendarHourly : this.props.match.params.hourly});
        }
    }


  handleFormSubmit({name, email, password}){
    this.props.signupUser({name, email, password, accessLevel:"owner"}, () => {
      this.props.history.push("/");
    });
  }

  renderAlert(){
    if(this.props.errorMessage){
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }


  renderField(field){
    const fieldClassName = `form-group ${field.meta.touched && field.meta.error ? 'has-danger' : ''}`
    return(
        <div className={fieldClassName}>
            <label>{field.label}</label>
            <input className="form-control"
                type="text"
                {...field.input}
            />
            <div className="text-help">
                {field.meta.touched ? field.meta.error : ""}
            </div>
        </div>
    )
  }
  
  renderPasswordField(field){
    const fieldClassName = `form-group ${field.meta.touched && field.meta.error ? 'has-danger' : ''}`
    return(
      <div className={fieldClassName}>
        <label>{field.label}</label>
        <input className="form-control"
          type="password"
          {...field.input}
        />
        <div className="text-help">
          {field.meta.touched ? field.meta.error : ""}
        </div>
      </div>
    )
  }

  cancelNewBranchForm(){
    this.props.history.push("/myaccount");
  }

  handleClinicChange = (e, data) => {
    const {year, monthIndex, selectedDate } = this.props.calendar;
    const branchId = data.value;
    this.props.setBranch(branchId, (err) => {
      const values = {year, monthIndex, selectedDate, branchId};
      this.props.getBranchCalendar(values, (err, message) => {
        if(err){          // TODO handle error
          alert(message);
        }
      });
    });
  }

  buildBranchDdlOptons = () => {
    const ddlOptions = _.map(this.props.branch.branches, function(obj, key){
      return { key : obj._id, text : obj.name, value:obj._id }
    });
    const newOption = { key: '0', value: '0', text: txt.SELECT_CLINIC};
    ddlOptions.unshift(newOption);
    return ddlOptions;
  }



  render(){
    const {handleSubmit, branch} = this.props;
    const state = this.state;
    const ddlBranchOptions = this.buildBranchDdlOptons();

    return(
      <div>
        <TopMenu />
        <ProviderMenu />
      <div className="ui stackable grid myaccount">
            <div className="six wide column myaccount-left">
                <Dropdown
                    onChange={this.handleClinicChange}
                    placeholder={txt.SELECT_CLINIC}
                    search
                    selection
                    value = {(branch.selectedBranch == "0") ? localStorage.getItem("lastSelectedBranchId") : branch.selectedBranch}
                    options={ddlBranchOptions}
                    button
                />
                {this.state.routeSection === "calendar" ? 
                <MonthCalendar 
                  calendar = {this.props.calendar}
                />: ""}
            </div>
            <div className="nine wide column">
                {this.state.calendarHourly == "1" ? 
                <HourlyCalendar 
                  updateCalendar={this.props.updateCalendar}
                  calendar = {this.props.calendar}
                  initReduxCalendar = {this.props.initReduxCalendar}
                  saveCalendar = {this.props.saveCalendar}
                  branch = {this.props.branch}
                  customers = {this.props.customers}
                  assignCustomerToTimeSlot = {this.props.assignCustomerToTimeSlot}
                  addNewCustomer = {this.props.addNewCustomer}
                  error = {this.props.error}
                  getCustomers = {this.props.getCustomers}
                  getBranchCalendar = {this.props.getBranchCalendar}
                  setSelectedCustomer = {this.props.setSelectedCustomer}
                  setAppointmentDuration = {this.props.setAppointmentDuration}
                  setAppointmentDetails = {this.props.setAppointmentDetails}
                  saveAppointment = {this.props.saveAppointment}
                />: ""}
            </div>
            <div className="one wide column">
            </div>
        </div>
      </div>
    )
  }
}


function  mapStateToProps(state){
  const {auth, branch, calendar, customers, error} = state;
  return {auth, branch, calendar, customers, error};
  // return {auth: state.auth, branch: state.branch, calendar: state.calendar, customers: state.customers}
}
export default withRouter(
    connect(mapStateToProps, actions)(Account)
    );
