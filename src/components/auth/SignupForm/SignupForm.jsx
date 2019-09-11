import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import * as actions from '../../../actions';
import './SignupForm.css';
import TopMenu from '../../../components/TopMenu/TopMenu';
import txt from '../../../text/config';


class SignupForm extends Component{

  
  render(){
    return(
      <div className="signup-form">
        <TopMenu />
        <div className="signupchoice">
          <div className="ui buttons">
            <Link to="/signup/clinic" className="ui violet button">{txt.SIGN_UP_DENTAL_CLINIC}</Link>
            <Link to="/signup/patient" className="ui teal button">{txt.SIGN_UP_PATIENT}</Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {errorMessage: state.auth.error}
}
export default withRouter(connect(mapStateToProps, actions)(SignupForm));
