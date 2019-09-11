import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import * as txt from '../../text/EN';

import './NewBranchForm.css';

class NewBranchForm extends Component {

    handleFormSubmit({name, email, address}){
        this.props.addNewBranch({name, email, address}, () => {
        this.props.history.push("/myaccount");
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
    
    render(){
        const {handleSubmit} = this.props;
        return(
        <div>
        <div>
            <div className="">
            <h4>{txt.DENTAL_CLINIC}</h4>
            <form className="ui form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <div>
                <Field
                className="field"
                label={txt.BRANCH_NAME}
                name="name"
                component={this.renderField}
                />
                <Field
                className="field"
                label={txt.BRANCH_EMAIL}
                name="email"
                component={this.renderField}
                />
                <Field
                className="field"
                label={txt.ADDRESS}
                name="address"
                component={this.renderField}
                />
                {this.renderAlert()}
                <button type="submit" className="ui primary button" style={styles.submitButton}>{txt.ADD_BRANCH}</button>
                <a className="ui secondary button" style={styles.submitButton} onClick={this.props.cancelForm}>{txt.CANCEL}</a>
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
  if(!formProps.address){
    errors.address = "Please enter the address";
  }
  if(!formProps.name){
    errors.name = "Please enter a branch name";
  }
  return errors;
}

export default reduxForm({
  form: 'newBranchForm',
  fields: ['mane', 'email', 'address'],
  validate : validate
})(NewBranchForm);
