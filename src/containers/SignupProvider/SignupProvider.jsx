import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import TopMenu from '../../components/TopMenu/TopMenu';

import * as actions from '../../actions';
import './SignupProvider.css';
import txt from '../../text/config';


class SignupProvider extends Component{
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

  render(){
    const {handleSubmit} = this.props;
    return(
      <div className="signup-provider-form">
        <TopMenu />
      <div>
        <div className="signupForm">
        <h4>{txt.DENTAL_CLINIC} {txt.OR} {txt.DENTAL_CLINIC_CHAIN} </h4>
          <form className="ui form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div>
            <Field
              className="field"
              label={txt.NAME_OF_CLINIC_OR_CHAIN}
              name="name"
              component={this.renderField}
            />
            <Field
              className="field"
              label="Email"
              name="email"
              component={this.renderField}
            />
            <Field
              className="field"
              label={txt.PASSWORD}
              name="password"
              component={this.renderPasswordField}
            />
            <Field
              label={txt.CONFIRM_PASSWORD}
              name="passwordConfirm"
              component={this.renderPasswordField}
            />
            {this.renderAlert()}
            <button type="submit" className="ui primary button" style={styles.submitButton}>Submit</button>
          </div>
          </form>
        </div>
      </div>
      </div>
    )
  }
}

const styles = {
  submitButton : {
    marginTop: 10
  } 
}

function validate(formProps){
  const errors = {};

  if(!formProps.email){
    errors.email = "Please enter an email";
  }
  if(!formProps.password){
    errors.password = "Please enter a password";
  }
  if(!formProps.passwordConfirm){
    errors.passwordConfirm = "Please enter a password confirmation";
  }

  if(formProps.password !== formProps.passwordConfirm){
    errors.passwordConfirm = "Passwords must match";
    errors.password = "Passwords must match";
  }
  return errors;
}

function  mapStateToProps(state){
  return {errorMessage: state.auth.error}
}
export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm'],
  validate : validate
})(connect( mapStateToProps, actions)(SignupProvider));
