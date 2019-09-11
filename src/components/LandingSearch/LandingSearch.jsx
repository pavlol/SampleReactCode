import _ from 'lodash';
import React, {Component} from 'react';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import txt from '../../text/config';
import {SELECTED_BRANCH_ID} from '../../actions/types';
import {
  withRouter, 
  Link,
  Redirect
} from 'react-router-dom';
import { Button, Header, Icon, Image, Dropdown } from 'semantic-ui-react';
import './LandingSearch.css';

class LandingSearch extends Component{
    constructor(props){
        super(props);
        this.state = {
            date : new Date(),
            showCalendar : false,
            searchLocation : "старе затишшя"//txt.SEARCH_EVERYWHERE
        }
    }

    onChange = date => this.setState({ date });

    toggleCalendar = () => {
        this.setState({showCalendar : !this.state.showCalendar});
    }

    handleSelectDay = (date) => {
        console.log("handleSelectDay", date);
        this.setState({showCalendar : !this.state.showCalendar, date});
    }

    handleLocationInput = (e) => {
        this.setState({"searchLocation" : e.target.value});
    }

    findAvailableBranches = () => {
        let place = this.state.searchLocation;
        const {latAreaDiff, lonAreaDiff} = this.props.mapRedux;
        if (place === txt.SEARCH_EVERYWHERE || place === "" || place === null || place == 'undefined') {
            place = "Kharkiv city rada, Kharkiv Oblast, Ukraine";
        }
        this.props.findAreaCoordByLocationName({place}, (err, message, payload) => {
            if(err){
                console.log("error finding area coordinates");
            }
            else{
                const startBoundsCoord = [+payload.coord[0] + latAreaDiff, +payload.coord[1] - lonAreaDiff]; 
                const endBoundsCoord = [+payload.coord[0] - latAreaDiff, +payload.coord[1] + lonAreaDiff]; 
                const searchBounds = [startBoundsCoord, endBoundsCoord];
                
                const values = {searchBounds, date: this.state.date};
                this.props.findBranchesByAvailableDate(values, (errorSearchByDate, messageSerachByDate)=>{
                    if(errorSearchByDate){
                        console.log("errorSearchByDate"); 
                    }
                });
            }
        });
    }

    clearLocationInput = () => {
        this.setState({searchLocation : ""});
    }

    handleLocationKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.findAvailableBranches();
        }
    }

    render(){
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
        return(
            <div className="ui form landing-search">
                <div className="fields">
                    <div className="five wide field">
                        <div className="ui right labeled left icon input">
                            <i className="location arrow icon"></i>
                            <input 
                            type="text" 
                            id="locationSearchField"
                            placeholder={txt.WHERE_QUESTION} 
                            value={this.state.searchLocation}
                            onChange={this.handleLocationInput}
                            onKeyPress={(event) => this.handleLocationKeyPress(event)}
                            />
                            <div className="ui label" onClick={this.clearLocationInput}>
                                <i className="close icon"></i>
                            </div>
                        </div>
                    </div>
                    <div className="eight wide field">
                        <div className="ui left icon input"  onClick={this.toggleCalendar}>
                            <input type="text" value={this.state.date.toLocaleDateString("uk-UA", options)} readOnly={true} placeholder={txt.WHEN_QUESTION} />
                            <i className="calendar alternate outline icon"></i>
                        </div>
                        <Calendar
                            onChange={this.onChange}
                            value={this.state.date}
                            className = {this.state.showCalendar ? "showCalendar" : "hideCalendar"}
                            onClickDay = {this.handleSelectDay}
                        />
                    </div>
                    <div className="three wide field">
                        <button className="ui labeled icon button" onClick={this.findAvailableBranches}>
                            <i className="search icon"></i>
                            {txt.SEARCH}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingSearch;