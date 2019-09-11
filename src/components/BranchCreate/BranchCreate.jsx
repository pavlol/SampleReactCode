import _ from "lodash";
import React, {Component} from "react";
import {reduxForm, Field} from 'redux-form';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import txt from '../../text/config';
import {
    ADD_NEW_BRANCH,
    } from '../../actions/types';
import './BranchCreate.css';
import spinnerGif from '../../img/spinner_770.gif';

class BranchCreate extends Component {
    constructor(props){
        super(props);
        this.state = {
            showWaitingSpinner : false,
            error : true,
            showSavedConfirmation : true,
            addressError : false,
            addressErrorMessage : ""
            }
    }

    handleFormSubmit({name, address, phoneNumber, email}){
        this.setState({ showWaitingSpinner : true, error: false, showSavedConfirmation: false,
        addressError : false,
        addressErrorMessage : "" });
        
        this.props.findCoordByAddress({address, branchId : "0"}, (err, message, coord) => {
            if(!err){
                this.props.addNewBranch({name, address, phoneNumber, email, coord}, (error) => {
                    this.setState({ showWaitingSpinner : false, showSavedConfirmation: !error, error,
                    addressError : err, 
                    addressErrorMessage : message });
                });
            }
            else{
                this.setState({ showWaitingSpinner : false, 
                addressError : true, 
                addressErrorMessage : message,
                error : false });
            }
        });
    }

    renderError(){
        const reduxErr = this.props.branchErrors[ADD_NEW_BRANCH];
        if(reduxErr && this.state.error){
            return(
                <div className="ui large red basic label">
                    {txt.ERROR_BRANCH_NOT_SAVED} {reduxErr}
                </div>
            )
        }
    }

    renderSuccessConfirmation(){
        if(!this.state.error && this.state.showSavedConfirmation){
            return(
                <div className="ui large green basic label">
                    {txt.BRANCH_SAVED_SUCCESSFULLY}
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

    handleCloseModal = () => {
        this.props.handleModalClose();
        this.setState({error : false, showSavedConfirmation:false });
    }
        
    render(){
        const {showWaitingSpinner, showSavedConfirmation} = this.state;
        const {handleSubmit, error, handleModalClose, branches} = this.props;
        return(
    <div>
        <form className="ui form" 
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
            <div>
            <Field
            className="field"
            label={txt.BRANCH_NAME}
            name="name"
            component={this.renderField}
            placeholder={txt.BRANCH_NAME}
            />
            <Field
            className="field"
            label={txt.ADDRESS}
            name="address"
            component={this.renderField}
            placeholder={txt.ADDRESS}
            />
            <Field
            className="field"
            label={txt.PHONE_NUMBER}
            name="phoneNumber"
            component={this.renderField}
            placeholder={txt.PHONE_NUMBER}
            />
            <Field
            className="field"
            label={txt.BRANCH_EMAIL}
            name="email"
            component={this.renderField}
            placeholder={txt.BRANCH_EMAIL}
            />
            <button type="submit" className="ui primary button">{txt.SAVE}</button>
            <a className="ui secondary button" onClick={this.handleCloseModal}>{txt.CANCEL}</a>
            {/* <a className="ui secondary button" onClick={this.handleFormSubmit.bind(this)}>show</a> */}
            {this.renderError()}
            {this.renderSuccessConfirmation()}
        </div>
        </form>
        <Modal
            open={showWaitingSpinner}
            // onOpen={this.handleNewCustomerModalOpen}
            // onClose={this.handleNewCustomerModalClose}
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

  if(!formProps.name){
    errors.name = `Please enter ${txt.BRANCH_NAME}`;
  }
  if(!formProps.address){
    errors.address = `Please enter ${txt.ADDRESS}`;
  }
  if(!formProps.phoneNumber){
    errors.phoneNumber = `Please enter ${txt.PHONE_NUMBER}`;
  }
  if(!formProps.email){
    errors.email = `Please enter ${txt.BRANCH_EMAIL}`;
  }
  return errors;
}


BranchCreate = reduxForm({
    form: 'branchCreateForm',
    fields: ['name', 'address', 'phoneNumber', "email"],
    validate : validate,
    initialValues: {
        name: "", address:"", phoneNumber: "", email : ""
    }
})(BranchCreate);
export default BranchCreate;