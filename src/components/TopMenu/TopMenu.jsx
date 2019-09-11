import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import * as actions from '../../actions';
import {BRAND_NAME} from '../../config';
import txt from '../../text/config';

let menuClass = {brand : "active item", blog : "item", editor: "item"};
const languages = [{langId : "EN", name : "English"}, {langId : "RU", name : "Русский"}];


class TopMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalLanguageOpen : false
        }
    }

    componentDidUpdate(){
        this.showEditorButton();
    }

    updateMenuActiveItem = () => {
        const route = this.props.match.path;
        if(route.includes("/blog")){
            menuClass = {brand : "item", blog : "active item", editor: "item", myaccount: "item"};
        }
        else if(route === "/"){
            menuClass = {brand : "active item", blog : "item", editor:"item", myaccount: "item"};
        }
        else if(route === "/editor"){
            menuClass = {brand : "item", blog : "item", editor: "active item", myaccount: "item"};
        }
        else if(route.includes("/myaccount")){
            menuClass = {brand : "item", blog : "item", editor: "active item", myaccount: "active item"};
        }
    }

    handleSignoutClick(){
        this.props.signoutUser();
    }

    showEditorButton(){
    if(this.props.auth.authenticated && this.props.auth.accessLevel==="editor"){
        return (
            <Link 
            className={menuClass.editor} 
            to="/editor" 
            >{txt.EDITOR}</Link>
        )
    }
  }

  toggleSigninButtonText(){
    const lang = localStorage.getItem("lang");
    if(this.props.auth.authenticated){
      return (
        <div className="right menu">
            <Link to="/myaccount" className="ui item" className={menuClass.myaccount}>
                <i className="icon user"></i>{this.props.auth.name}
            </Link>
            <a className="ui item" onClick={this.handleSignoutClick.bind(this)}>
                <i className="icon sign out alternate"></i>{txt.SIGN_OUT}
            </a>
            <a className="ui item" onClick={this.showLanguageSelection}>
                <i className="world icon"></i>{lang}
            </a>
        </div>
      )
    }
    else{
      return (
            <div className="right menu">
                <Link className="ui item basic " to="/signin"><i className="icon sign in alternate"></i>{txt.SIGN_IN}</Link>
                <Link className="ui item basic " to="/signup"><i className="icon pencil"></i>{txt.SIGN_UP}</Link>
                <a className="ui item" onClick={this.showLanguageSelection}>
                    <i className="world icon"></i>{lang}
                </a>
            </div>
      )
    }
  }
    showLanguageSelection = () => {
        this.setState({modalLanguageOpen : true});
    }
    handleLanguageModalClose = () => {
        this.setState({modalLanguageOpen : false});
    }

    changeLanguage = (e) => {
        localStorage.setItem("lang", e.target.lang);
        this.setState({modalLanguageOpen : false});
        this.props.history.go(0);
    }

  render(){
    this.updateMenuActiveItem();
    return(
        <div className="ui secondary pointing menu" style={styles.topmenu}>
            <Link className={menuClass.brand} to="/" >{BRAND_NAME}</Link>
            {this.showEditorButton()}
            {this.toggleSigninButtonText()}
            
            <Modal
                open={this.state.modalLanguageOpen}
                size='mini'
                closeOnEscape={true}
                closeOnDimmerClick={true}
            >
        
                <Modal.Content>
                    <button className="ui basic button" onClick={this.changeLanguage} lang="EN">
                        <i className="gb flag "></i>English</button>
                    <button className="ui basic button" onClick={this.changeLanguage} lang="RU">
                        <i className="ru flag "></i>Русский</button>
                
                </Modal.Content>
            <Modal.Actions>
                <Button icon='close' content={txt.CLOSE} onClick={this.handleLanguageModalClose} />
            </Modal.Actions>
            </Modal>
        </div>
    )
  }
}

const styles = {
    topmenu : {
        height:50,
        fontSize:16
    }
}


function mapStateToProps(state){
  return{
    auth : state.auth
    }
}
export default withRouter(connect(mapStateToProps, actions)(TopMenu));
