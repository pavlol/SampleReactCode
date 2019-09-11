import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import {Field, reduxForm} from "redux-form";
import TopMenu from '../../components/TopMenu/TopMenu';
import * as actions from '../../actions';
import './PasswordResetForm.css';
import txt from '../../text/config';

class PasswordResetForm extends Component{
    constructor(props){
        super(props);
        const {recoveryId, email} = this.props.match.params;
        this.state={recoveryId, email, error:false, errorMessage : "", showSuccessMessage : false};
    }
    
    handleFormSubmit({newPassword}){
        if(this.state.recoveryId && this.state.email && newPassword){
            this.props.resetPassword({recoveryId : this.state.recoveryId, newPassword, email: this.state.email}, (error, errorMessage) => {
                if(error){
                    this.setState({error, errorMessage, showSuccessMessage:false});
                }
                else{
                    this.setState({error, errorMessage : "", showSuccessMessage: true});
                }
            });
        }
        else{
            console.log("handleFormSubmit error", newPassword, this.state.email, this.state.recoveryId);
        }
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

    renderAlert(){
        if(this.props.errorMessage){
            return(
                <div className="alert alert-danger">
                <strong>Oops!</strong> {this.props.errorMessage}
                </div>
            )
        }
    }

    renderContent(){
        if(!this.state.showSuccessMessage){
            return (
                <div>
                    <Field
                        className="field"
                        label="New Password"
                        name="newPassword"
                        component={this.renderPasswordField}
                    />
                    <Field
                        className="field"
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        component={this.renderPasswordField}
                    />
                    {this.renderAlert()}
                    <button type="submit" className="ui primary button" style={styles.submitButton}>{txt.SUBMIT}</button>
                </div>
            )
        }
        else{
            return(
                <div>
                    <p>
                        Password was changed successfully. 
                    </p>
                    <p>Please login with your new Password.</p>
                </div>
            )
        }
    }

    render(){
        const {handleSubmit} = this.props;
        return(
        <div className="password-reset-form">
            <TopMenu />
            <div className="ui stackable grid">
                <div className="six wide column password-reset-form-centre">
                    <form className="ui form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} >
                        {this.renderContent()}
                    </form>
                </div>
            </div>
        </div>
        )
    }
}


function validate(formProps){
    const errors = {};

    if(!formProps.newPassword){
        errors.newPassword = txt.PLEASE_ENTER_NEW_PASSWORD;
    }
    if(!formProps.confirmNewPassword){
        errors.confirmNewPassword = txt.PLEASE_CONFIRM_NEW_PASSWORD;
    }
    if(formProps.newPassword !== formProps.confirmNewPassword){
        errors.newPassword = txt.PASSWORDS_DO_NOT_MATCH;
        errors.confirmNewPassword = txt.PASSWORDS_DO_NOT_MATCH;
    }
    return errors;
}

const styles = {
  submitButton : {
    marginTop: 10
  } 
}

export default withRouter(
    reduxForm({
        form: 'passwordResetForm',
        fields: ['newPassword', 'confirmNewPassword'],
        validate : validate
        })(connect(null, actions)(PasswordResetForm))
    );
