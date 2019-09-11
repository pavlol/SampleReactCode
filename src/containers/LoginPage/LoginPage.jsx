import React, {Component} from 'react';
import {connect} from 'react-redux';
import TopMenu from '../../components/TopMenu/TopMenu';
import SigninForm from '../../components/auth/SigninForm/SigninForm';
import * as actions from '../../actions';
import './LoginPage.css';
import txt from '../../text/config';


class LoginPage extends Component{
  
  render(){
    const history = this.props.history;
    // debugger
    if(!this.props.authenticated){
      return(
      <div className="login-page">
        <TopMenu />
        <div className="ui stackable grid">
          <SigninForm 
          history={history} 
          signinUser = {this.props.signinUser}
          />
        </div>
      </div>
    )
    }
    else{
      this.props.history.push('/');
      return <p></p>
    }
  }
}
function mapStateToProps(state){
  return {
    authenticated : state.auth.authenticated
  }
}

export default connect(mapStateToProps, actions)(LoginPage);
