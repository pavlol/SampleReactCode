import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import txt from '../../text/config';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Modal, Image, Dropdown } from 'semantic-ui-react'
import './ProviderMenu.css';

let menuClass = {customers : "item", appointments : "item", branches: "item"};

class ProviderMenu extends Component{

    updateMenuActiveItem = () => {
        const routeParams = this.props.match.params;

        if(routeParams.section === "calendar"){
            menuClass = {customers : "item", appointments : "active item", branches: "item"};
        }

        const routePath = this.props.match.path;

        if(routePath.includes("/customers")){
            menuClass = {customers : "active item", appointments : "item", branches: "item"};
        }
        else if(routePath.includes("/branches")){
            menuClass = {customers : "item", appointments : "item", branches: "active item"};
        }
    }

    render(){
        this.updateMenuActiveItem();

        const t = new Date();
        const calendarRoute = `/myaccount/calendar/date/${t.getDate()}/${t.getMonth()}/${t.getFullYear()}/1`;
        return(
            <div className="ui three item menu">
                <Link className={menuClass.customers} to="/myaccount/customers">{txt.CUSTOMERS}</Link>
                <Link className={menuClass.appointments} to={calendarRoute}>{txt.APPOINTMENTS}</Link>
                <Link className={menuClass.branches} to="/myaccount/branches">{txt.BRANCHES}</Link>
            </div>
        )
    }
}

export default withRouter(ProviderMenu);