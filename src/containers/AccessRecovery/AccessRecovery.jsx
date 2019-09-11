import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';

import TopMenu from '../../components/TopMenu/TopMenu';
import * as actions from '../../actions';
import './AccessRecovery.css';
import txt from '../../text/config';


class AccessRecovery extends Component{
    constructor(props){
        super(props);
        this.state={email:"aric.gibson@ethereal.email", error:false, errorMessage : "", showSuccessMessage : false};

    }
    
    handleSubmit(e){
        e.preventDefault();
        if(this.state.email){
            this.props.recoverAccess(this.state.email, (error, errorMessage) => {
                if(error){
                    this.setState({error, errorMessage});
                }
                else{
                    this.setState({error, errorMessage : "", showSuccessMessage: true});
                }
            });
        }
    }

    handleEmailInput = (e) => {
        const email = e.target.value;
        this.setState({email});
    }

    renderContent(){
        if(!this.state.showSuccessMessage){
            return (
                <div>
                    <p></p>
                    <div>
                        <label>Type your registered email here</label>
                        <input type="text" placeholder="your email" value={this.state.email} 
                        onChange={this.handleEmailInput}
                        className="form-control"/>
                        <div>
                            <button className="ui primary button" style={{marginTop:"10px"}} 
                            onClick={this.handleSubmit.bind(this)}>{txt.SUBMIT}</button>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <p>
                        We have sent an email with the link to reset the password to provided email address.
                    </p>
                    <p>Please check you inbox to click on the link to reset the password</p>
                </div>
            )
        }
    }

    render(){
        return(
        <div className="access-recovery">
            <TopMenu />
            <div className="ui stackable grid">
                <div className="six wide column access-recovery-centre">
                    <form className="ui form">
                        {this.renderContent()}
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
function mapStateToProps(state){
  return {
    authenticated : state.auth.authenticated
  }
}

export default withRouter(connect(mapStateToProps, actions)(AccessRecovery));
