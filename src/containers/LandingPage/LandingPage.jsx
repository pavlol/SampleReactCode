import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import txt from '../../text/config';
import {reduxForm, Field} from 'redux-form';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Image, Dropdown } from 'semantic-ui-react'
import TopMenu from '../../components/TopMenu/TopMenu';
import LandingSearch from '../../components/LandingSearch/LandingSearch';
import TestMap from '../../components/TestMap/TestMap';
import './LandingPage.css';

class LandingPage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="landing-page">
                <TopMenu />
                <LandingSearch 
                findAreaCoordByLocationName = {this.props.findAreaCoordByLocationName}
                findBranchesByAvailableDate = {this.props.findBranchesByAvailableDate}
                mapRedux = {this.props.map}
                />
                <TestMap 
                location={this.props.location} 
                match={this.props.match}
                history= {this.props.history} 
                findCoordByAddress = {this.props.findCoordByAddress}
                mapRedux = {this.props.map}
                getBranchesByArea = {this.props.getBranchesByArea}
                />
            </div>
        )
    }
}

function mapStateToProps(state){
    return {map : state.map};
}

export default withRouter(connect(mapStateToProps, actions)(LandingPage));