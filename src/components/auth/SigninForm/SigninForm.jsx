import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from "redux-form";
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';

import txt from '../../../text/config';

import * as actions from '../../../actions';
import './SigninForm.css';

class SigninForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      error : false,
      errorMessage : ""
    }

  }
  handleFormSubmit({email, password}){
    this.setState({error : false, errorMessage : ""});
    if(!email){
      this.setState({error : true, errorMessage : `${txt.PLEASE_ENTER_YOUR_EMAIL}`});
      return;
    }
    if(!password){
      this.setState({error : true, errorMessage : `${txt.PLEASE_ENTER_YOUR_PASSWORD}`});
      return;
    }

    this.props.signinUser({email, password}, (error, errorMessage) => {
      if(!error){
        this.props.reset();
        this.props.history.push("/myaccount");
      }
      else{
        this.setState({error, errorMessage});
      }
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
  renderError() {
    const {error,  errorMessage} = this.state;
        if(error){
            return(
                <div className="ui large red basic label">
                    {errorMessage}
                </div>
            )
        }
  }
  renderEmailField(field){
    const fieldClassName = `form-group ${field.meta.touched && field.meta.error ? 'has-danger' : ''}`
    return(
      <div className={fieldClassName}>
        <label>{field.label}</label>
        <input className="form-control"
          type="email"
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
    return (
      <div className="signin-form six wide column">
        {this.renderError()}
        <form className="ui form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <div>
          <Field
            className="field"
            label="Email"
            name="email"
            component={this.renderEmailField}
          />
          <Field
            className="field"
            label={txt.PASSWORD}
            name="password"
            component={this.renderPasswordField}
          />
          {this.renderAlert()}
          <button type="submit" className="ui primary button" style={styles.submitButton}>{txt.SUBMIT}</button>
          <p>
            <Link to="/accessrecovery">{txt.RESET_PASSWORD}</Link>
          </p>
        </div>
        </form>
      </div>
    );
  }
}

const styles = {
  submitButton : {
    marginTop: 10
  } 
}


export default withRouter(reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
})(SigninForm));
