import _ from "lodash";
import React, {Component} from "react";
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import * as txt from '../../text/EN';
import {
    ADD_NEW_CUSTOMER,
    GET_CUSTOMERS
    } from '../../actions/types';

import './EditCustomer.css';
import spinnerGif from '../../img/spinner_770.gif';

class EditCustomer extends Component {
    constructor(props){
        super(props);
        this.state = {
            edit : true, 
            showWaitingSpinner : false,
            fullName : "",
            error : true,
            showCustomerSavedConfirmation : true
            }
    }

    handleFormSubmit({firstName, lastName, middleName}){
        const customerId = this.props.customerId;
        this.setState({ showWaitingSpinner : true, fullName : "", error: false, showCustomerSavedConfirmation: false });
        this.props.editCustomer({customerId, firstName, lastName, middleName}, (error) => {
            this.setState({ showWaitingSpinner : false, showCustomerSavedConfirmation: !error, error });
        });
    }

    renderErrorAddCustomer(){
        const reduxErr = this.props.customerErrors[ADD_NEW_CUSTOMER];
        if(reduxErr && this.state.error){
            return(
                <div className="ui large red basic label">
                    {txt.ERROR_CUSTOMER_NOT_SAVED} {reduxErr}
                </div>
            )
        }
    }

    renderSuccessConfirmation(){
        if(!this.state.error && this.state.showCustomerSavedConfirmation){
            return(
                <div className="ui large green basic label">
                    {txt.CUSTOMER_SAVED_SUCCESSFULLY}
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

    handleCloseNewCustomerForm = () => {
        this.props.handleNewCustomerModalClose();
        this.setState({error : false, showCustomerSavedConfirmation:false });
    }
    componentDidMount() {
        const {firstName, lastName, middleName} = this.props.customers[this.props.customerId];
        this.props.initialize({ firstName, lastName, middleName });
    }
        
    render(){
        const {edit, showWaitingSpinner, fullName, showCustomerSavedConfirmation} = this.state;
        const {handleSubmit, error, handleNewCustomerModalClose, customers} = this.props;
        return(
    <div>
        <form className="ui form" 
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
            <div>
            <Field
            className="field"
            label={txt.FIRST_NAME}
            name="firstName"
            component={this.renderField}
            />
            <Field
            className="field"
            label={txt.LAST_NAME}
            name="lastName"
            component={this.renderField}
            />
            <Field
            className="field"
            label={txt.MIDDLE_NAME}
            name="middleName"
            component={this.renderField}
            />
            <button type="submit" className="ui  primary button">{txt.SAVE}</button>
            <a className="ui secondary button" onClick={this.handleCloseNewCustomerForm}>{txt.CANCEL}</a>
            {this.renderErrorAddCustomer()}
            {this.renderSuccessConfirmation()}
        </div>
        </form>
        <Modal
            open={showWaitingSpinner}
            size='mini'
            dimmer='inverted'
            closeOnEscape={false}
            closeOnDimmerClick={false}
            basic
        >
            <Modal.Content>
            <div className="ui one column centered grid">
                <Image src={spinnerGif}/>
            </div>
            <div className="ui one column centered grid">
                <h3>
                    {txt.SAVING}
                 </h3>
            </div>
            </Modal.Content>
        </Modal>
    </div>
        )
    }

}


function validate(formProps){
  const errors = {};

  if(!formProps.firstName){
    errors.firstName = `Please enter ${txt.FIRST_NAME}`;
  }
  if(!formProps.lastName){
    errors.lastName = `Please enter ${txt.LAST_NAME}`;
  }
  if(!formProps.middleName){
    errors.middleName = `Please enter ${txt.MIDDLE_NAME}`;
  }
  return errors;
}


EditCustomer = reduxForm({
    form: 'editCustomerForm',
    fields: ['firstName', 'lastName', 'middleName'],
    validate : validate,
})(EditCustomer);

export default EditCustomer;