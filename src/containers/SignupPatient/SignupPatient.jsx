import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import * as actions from '../../actions';
import './SignupPatient.css';
import txt from '../../text/config';
import TopMenu from '../../components/TopMenu/TopMenu';


let menuClass = {clinic : "item", patient : "active item"};


class SignupPatient extends Component{
  handleFormSubmit({email, password}){
    this.props.signupUser({email, password}, () => {
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

  updateMenuActiveItem = () => {
        const route = this.props.match.path;
        // console.log("route", route);
        if(route.includes("/signup/clinic")){
            menuClass = {clinic : "active item", patient : "item"};
        }
        else if(route === "/signup/patient"){
            menuClass = {clinic : "item", patient : "active item"};
        }
        // console.log('menuClass', menuClass);
    }

  render(){
    const {handleSubmit} = this.props;
    this.updateMenuActiveItem();
    return(
      <div className="signup-patient-form">
        <TopMenu />
          <div className="signupForm">
          <h4>{txt.PATIENT} {txt.OR} {txt.USER} </h4>

            <form className="ui form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              <div>
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
              <button type="submit" className="ui primary button" style={styles.submitButton}>{txt.SUBMIT}</button>
            </div>
            </form>
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
})(connect( mapStateToProps, actions)(SignupPatient));
